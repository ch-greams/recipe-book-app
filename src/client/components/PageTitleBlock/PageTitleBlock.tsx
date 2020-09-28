import React, { Component } from "react";
import { AnyAction } from "redux";
import Utils from "../../../common/utils";
import styles from "./PageTitleBlock.scss";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
}
interface State {
    isTitleInputsOpen: boolean;
}

export default class PageTitleBlock extends Component<Props, State> {
    public state: State = {
        isTitleInputsOpen: false,
    };


    private editTitle(): void {
        this.setState({ isTitleInputsOpen: true });
    }

    private confirmTitle(): void {
        this.setState({ isTitleInputsOpen: false });
    }

    private handleNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        Utils.keepCaretInPlace(window, event);

        this.props.updateName(
            (event.target.value || "").toUpperCase()
        );
    }

    private handleBrandEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        Utils.keepCaretInPlace(window, event);

        this.props.updateBrand(
            (event.target.value || "").toUpperCase()
        );
    }

    private handleSubtitleEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        Utils.keepCaretInPlace(window, event);

        this.props.updateSubtitle(
            (event.target.value || "").toUpperCase()
        );
    }

    private getTitleBlockStatic(name: string, brand: string, subtitle: string): JSX.Element {

        return (

            <div
                className={styles.titleBlock}
                onClick={this.editTitle.bind(this)}
            >

                <div className={styles.nameBlock}>

                    <div className={styles.nameText}>
                        {name.toUpperCase()}
                    </div>

                    <div className={styles.brandText}>
                        {brand.toUpperCase()}
                    </div>
                    
                </div>

                <div className={styles.subtitleBlock}>

                    <div className={styles.subtitleText}>
                        {subtitle.toUpperCase()}
                    </div>
                </div>
            </div>
        );
    }

    private getTitleBlockInput(name: string, brand: string, subtitle: string): JSX.Element {

        return (

            <div className={styles.titleBlock}>

                <div className={styles.nameBlock}>

                    <input
                        type={"text"}
                        className={styles.nameInput}
                        placeholder={"NAME"}
                        value={name.toUpperCase()}
                        onChange={this.handleNameEdit.bind(this)}
                    />

                    <input
                        type={"text"}
                        className={styles.brandInput}
                        placeholder={"BRAND"}
                        value={brand.toUpperCase()}
                        onChange={this.handleBrandEdit.bind(this)}
                    />
                    
                </div>

                <div className={styles.subtitleBlock}>

                    <input
                        type={"text"}
                        className={styles.subtitleInput}
                        placeholder={"SUBTITLE"}
                        value={subtitle.toUpperCase()}
                        onChange={this.handleSubtitleEdit.bind(this)}
                    />

                    <div
                        className={styles.confirmButton}
                        onClick={this.confirmTitle.bind(this)}
                    >
                        {"CONFIRM"}
                    </div>
                </div>
            </div>
        );
    }


    public render(): JSX.Element {

        const { name, brand, subtitle } = this.props;

        return (
            this.state.isTitleInputsOpen
                ? this.getTitleBlockInput(name, brand, subtitle)
                : this.getTitleBlockStatic(name, brand, subtitle)
        );
    }
}
