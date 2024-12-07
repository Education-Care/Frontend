import React from 'react'

import {useInputChange} from './hooks'
import {verifyTextInputType} from './validators'
import "../../../Styles/Survey.css"

export const SurveySelectInput = props => {
    const {object} = props

    return <select name={object.name} className={props.className} multiple={object.multiple}>
            <option hidden value>Select an option</option>
        {object.options.map((data, index)=> {
            return <option 
                    value={data.value} 
                        id={`${object.name}-${index}`} 
                        className={`form-check ${props.optionClassName}`}
                        key={`${object.type}-${index}`}>
                        {data.label}
                    </option>
        })}

    </select>

}

export const SurveyRadioInput = props => {
    const { object } = props;
    return (
        <div className={props.className}>
            <h4 className="question-text">
                {object.questionText} {props.required}
            </h4>
            {object.answers.map((data, index) => {
                return (
                    <div className={`form-check ${props.optionClassName}`} key={`${object.id}-${index}`}>
                        <input
                            className='form-check-input'
                            type= 'radio'
                            required= 'required'
                            value={data.score}
                            id={`${object.id}-${index}`}
                            name={`${object.id}`}
                        />
                        <label
                            className='form-check-label'
                            htmlFor={`${object.id}-${index}`}>
                            {data.answerText}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export const SurveyTextInput = props => {
    const {value, handleChange} = useInputChange(props.defaultValue, props.triggerCallback)
    const inputType = verifyTextInputType(props.type) ? props.type : 'text'
    const inputProps = {
        className: props.className ? props.className : 'form-control',
        onChange: handleChange,
        required: props.required,
        value: value,
        type: inputType,
        placeholder: props.placeholder ? props.placeholder : 'Your text...',
        name: props.name ? props.name : `${inputType}_${props.key}`
    }
    return inputType === 'textarea' ? 
    <textarea {...inputProps} /> :
     <input {...inputProps} />
}