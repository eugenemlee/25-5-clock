import React from 'react';

type buttonProps = {
    id: string;
    label: string;
    onClick(event: React.MouseEvent<HTMLElement>): void;
};

export function Button({ id, label, onClick }: buttonProps): JSX.Element {
    return (
        <div id={id} className={"button"} onClick={onClick} dangerouslySetInnerHTML={{ __html: label }}>
        </div>
    );
}