import { Controller } from 'react-hook-form';

const RadioButton = ({ id, control, rules, changeEvent, label, disabled = false, state, value, name }) => {

    return (
        <div>
            <Controller
                name={id}
                control={control}
                rules={rules ? rules : {}}
                render={({ field: { onChange } }) => (
                    <div className='radio-container'>
                        <input
                            id={id}
                            type='radio'
                            onChange={ e => {
                                onChange(e.target.value);
                                if (changeEvent) {
                                    changeEvent({
                                        name: e.target.name,
                                        value: e.target.value,
                                    });
                                }
                            }}
                            name={name}
                            disabled={disabled}
                            value={value}
                            checked={state === name}
                        />
                        <p>{label}</p>
                    </div>
                )}
            />
        </div>
    );
};

export default RadioButton;
