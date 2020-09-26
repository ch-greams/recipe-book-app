import React, { Component } from "react";
import styles from "./SelectInput.scss";



interface Props {
    options: string[];
}

// TODO: Add current value for selected
class SelectInput extends Component<Props> {
    public state = {}

    public render(): JSX.Element {

        const { options } = this.props;

        return (
            <select className={styles.selectInput}>
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }
}

export default SelectInput;
