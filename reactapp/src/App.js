import * as React from 'react';
import './App.css';
import { config } from './services/config';
import { FilePicker } from 'react-file-picker';
import axios from 'axios'

export class App extends React.PureComponent {
    state = {
        data: null,
    };

    getFullPageAnnotation = () => {
        if (!this.state.data.fullTextAnnotation) {
            return null;
        }
        return <h2>Look into the developer tools' console to see the full page annotation.</h2>
    };

    getTextAnnotations = () => {
        if (!this.state.data.textAnnotations || !this.state.data.textAnnotations.length) {
            return null;
        }
        let i = 1;
        const annotations = this.state.data.textAnnotations.map(dataRow => (
            <div key={'text-annotation-' + i++} className={'element'}>
                <strong>Text: {dataRow.description}</strong><br/>
                Locale: {dataRow.locale}<br/>
                Confidence: {dataRow.confidence}<br/>
                Vertices:<br/>
                <div className={'element__vertices'}>
                    0: (x: {dataRow.boundingPoly.vertices[0].x}, y: {dataRow.boundingPoly.vertices[0].y})<br/>
                    1: (x: {dataRow.boundingPoly.vertices[1].x}, y: {dataRow.boundingPoly.vertices[1].y})<br/>
                    2: (x: {dataRow.boundingPoly.vertices[2].x}, y: {dataRow.boundingPoly.vertices[2].y})<br/>
                    3: (x: {dataRow.boundingPoly.vertices[3].x}, y: {dataRow.boundingPoly.vertices[3].y})
                </div>
            </div>
        ));
        return (
            <>
                <h2>Text Annotations</h2>
                {annotations}
            </>
        );
    };

    getDominantColors = () => {
        if (!this.state.data.dominantColors) {
            return null;
        }
        let i = 1;
        return this.state.data.dominantColors.colors.map(color => {
            const c = `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`;
            return (
                <div key={'dominant-colors-' + i++} className={'color--wrapper'}>
                    <h2>Dominant Colors</h2>
                    <div className={'color__div'} style={{ backgroundColor: c }}/>
                    <div className={'color__info'}>
                        Score: {color.score.toFixed(4)}<br/>
                        Pixel Fraction: {color.pixelFraction.toFixed(4)}
                    </div>
                </div>
            );
        });
    };

    getData = () => {
        if (
            !this.state.data.fullTextAnnotation &&
            (!this.state.data.textAnnotations || !this.state.data.textAnnotations.length) &&
            !this.state.data.dominantColors
        ) {
            return <div>Visions API did not return any data for this image.</div>
        }
        return (
            <div>
                <div>{this.getFullPageAnnotation()}</div>
                <div>{this.getDominantColors()}</div>
                <div>{this.getTextAnnotations()}</div>
            </div>
        );
    };

    analyzeData = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            axios.post(config.backend.url, { image: encodeURIComponent(reader.result.toString()) })
                .then(response => {
                    console.log('_GOT_DATA_', response.data);
                    this.setState({ data: response.data })
                }).catch(error => {
                console.log('_got_error', error);
            });
        };
    };

    render() {
        let data = null;
        if (this.state.data) {
            data = this.getData();
        }
        return (
            <main>
                <h1>Image Analyzer</h1>
                <FilePicker
                    style={{ marginBottom: '1em' }}
                    extensions={['jpg', 'jpeg', 'png']}
                    onChange={this.analyzeData}
                >
                    <button>
                        Click to upload image
                    </button>
                </FilePicker>
                {data}
            </main>
        );
    }
}
