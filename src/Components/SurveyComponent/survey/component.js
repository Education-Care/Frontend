import React, { useEffect, useState } from 'react';
import "../../../Styles/Survey.css";
import { useNavigate } from 'react-router-dom';
import { getQuestionRandomAsync } from '../../../services/questions';
import { verifyTextInputType } from './validators';
import { createPhq9Response } from '../../../services/Responses';
import { SurveyRadioInput } from './inputs';

export const Survey = (props) => {
  const [page, setPage] = useState(1);
  const [isFinalPage, setIsFinalPage] = useState(false);
  const [surveyValues, setSurveyValues] = useState({});
  const [loadedInputs, setLoadedInputs] = useState([]);
  const navigate = useNavigate();

  // Fetch câu hỏi ngẫu nhiên
  const fetchListRandomQuestion = async () => {
    try {
      const loadedInputs = await getQuestionRandomAsync(); // Fetch questions from API
      setLoadedInputs(loadedInputs); // Store the questions in state
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  useEffect(() => {
    console.log('useEffect has been called!');
    fetchListRandomQuestion(); // Call function to fetch questions when component mounts
  }, []);

  // Trigger backend update when form is submitted
  const triggerBackendUpdate = async () => {
    // Tạo đối tượng response theo mẫu CreatePhq9ResponseDto
    const responseData = {
      userId: 1, // Giả sử userId là 1, bạn có thể thay bằng dữ liệu thực tế
      answers: Object.keys(surveyValues).map(key => {
        const questionId = parseInt(key); // key chính là id câu hỏi
        return {
          questionId,
          answerValue: parseInt(surveyValues[key]), // Đảm bảo rằng answerValue là số
        };
      }),
    };

    try {
      // Gửi yêu cầu POST tới API
      const response = await createPhq9Response(responseData); // Dịch vụ này sẽ thực hiện gửi dữ liệu đến API
      const totalScore = response.data.totalScore;
      const depressionLevel = response.data.depressionLevel;
      console.log("response", response)
      navigate('/result-survey', { state: { totalScore, depressionLevel  } }); // Sau khi gửi thành công, chuyển tới trang kết quả
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const updatedSurveyValues = { ...surveyValues }; // Tạo bản sao của surveyValues

    // Lấy dữ liệu từ các input
    for (let formInput of event.target.elements) {
      const verifyType = verifyTextInputType(formInput.type);

      if (verifyType) {
        updatedSurveyValues[formInput.name] = formInput.value; // Cập nhật surveyValues
      }

      if (formInput.type === 'select-one') {
        updatedSurveyValues[formInput.name] = formInput.value;
      }

      if (formInput.type === 'select-multiple') {
        const selected = [].filter.call(formInput.options, option => option.selected);
        const values = selected.map(option => option.value);
        updatedSurveyValues[formInput.name] = values;
      }

      if (formInput.checked) {
        updatedSurveyValues[formInput.name] = formInput.value;
      }
    }

    setSurveyValues(updatedSurveyValues); // Cập nhật lại state surveyValues

    const nextPage = page + 1;
    const inputs = loadedInputs ? loadedInputs.filter(inputOption => inputOption.id === nextPage) : [];

    if (isFinalPage) {
      triggerBackendUpdate(); // Gọi API khi đến trang cuối cùng
    } else {
      if (inputs.length === 0) {
        setIsFinalPage(true);
      } else {
        setPage(nextPage);
      }
    }
  };

  // Get the current inputs for the current page
  const inputs = loadedInputs ? loadedInputs.filter(inputOption => inputOption.id === page) : [];

  return (
    <div className="survey-container">
      <div className="survey-introduction">
        <div className="logo-container">
          <h2 className="survey-title" id="page-logo">EduCare</h2>
        </div>
        <p className="survey-description">
          Bảng câu hỏi sức khỏe bệnh nhân (PHQ-9)
        </p>
        <h3 className='survey-title_sub'>Trong 2 tuần qua</h3>
        <p className="survey-description">
          Bạn có thường xuyên cảm thấy khó chịu do những vấn đề sau đây không?
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {isFinalPage !== true &&
          inputs.map((obj, index) => {
            const className = 'form-control mb-2 animated fadeIn';
            const inputKey = `input-${index}-${page}`;
            return (
              <SurveyRadioInput
                object={obj}
                key={inputKey}
                className={className}
                {...obj}
              />
            );
          })}
        {isFinalPage === true && (
          <p className="final-message">Are you finished?</p>
        )}
        <div className="button-container">
          {isFinalPage ? (
            <button
              className="btn btn-primary save-btn"
              name="save_btn"
              type="submit"
            >
              Save
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary present-btn"
                name="present_btn"
                type="submit"
              >
                Present
              </button>
              <button
                className="btn btn-secondary continue-btn"
                name="continue_btn"
                type="submit"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
