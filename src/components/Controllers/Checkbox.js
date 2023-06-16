import { Controller } from 'react-hook-form';

const Checkbox = ({ id, control, rules, changeEvent, label, disabled = false, isChecked, value }) => {

    return (
        <div>
            <Controller
                name={id}
                control={control}
                rules={rules ? rules : {}}
                render={({ field: { onChange } }) => (
                    <div className='checkbox-container'>
                        <input
                            id={id}
                            type='checkbox'
                            onChange={ e => {
                                onChange(e.target.checked);
                                if (changeEvent) {
                                    changeEvent({
                                        value: e.target.value,
                                        checked: e.target.checked,
                                    });
                                }
                            }}
                            checked={isChecked}
                            disabled={disabled}
                            value={value}
                        />
                        <p>{label}</p>
                    </div>
                )}
            />
        </div>
    );
};

export default Checkbox;
