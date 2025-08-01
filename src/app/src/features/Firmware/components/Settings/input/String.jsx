import React from 'react';

import styles from './index.module.styl';

const String = ({ value, maxChars = 64, onChange, disabled }) => {
    return (
        <div className={styles.numberInputs}>
            <input
                type="text"
                className={styles.formControlModal}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                value={value}
                maxLength={maxChars}
                disabled={disabled}
            />
        </div>
    );
};

export default String;
