import * as React from 'react';
import './styles/data-input.css';
import { FilePicker } from 'react-file-picker';

export function DataInput({onFileSubmit, onUrlSubmit}) {
    const handleUrlSubmit = evt => {
        evt.preventDefault();
        if (!inputNode) {
            return;
        }
        submitUrl(inputNode.value);
    };

    const submitUrl = url => onUrlSubmit(url);

    let inputNode = null;

    return (
        <div className={'data-input'}>
            <div className={'input--wrapper'}>
                <div className={'input__file'}>
                    <FilePicker
                        extensions={['jpg', 'jpeg', 'png']}
                        onChange={onFileSubmit}
                    >
                        <button>
                            Upload Image
                        </button>
                    </FilePicker>
                </div>
                <span>OR</span>
                <div className={'input__url'}>
                    <form>
                        <input
                            type={'url'}
                            name={'url'}
                            placeholder={'Enter a YouTube URL'}
                            ref={node => inputNode = node}
                        />
                        <button onClick={handleUrlSubmit}>Submit URL</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
