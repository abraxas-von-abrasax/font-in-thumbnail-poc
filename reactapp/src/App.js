import * as React from 'react';
import './App.css';
import { config } from './services/config';
import { FilePicker } from 'react-file-picker';
import axios from 'axios'

export class App extends React.PureComponent {
    state = {
        data: null,
        image: null
    };

    getFullPageAnnotation = () => {
        if (!this.state.data.fullTextAnnotation) {
            return null;
        }
        console.log('_FULL_PAGE_ANNOTATION_', this.state.data.fullTextAnnotation);
        return (
            <>
                <h2>Full Text Annotation</h2>
                <p>Look into the developer tools' console to see the full page annotation.</p>
            </>
        );
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

        function rgbToHex(rgb) {
            const hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                return '0' + hex;
            }
            return hex;
        }

        let i = 1;
        const colors = this.state.data.dominantColors.colors
            .sort((first, second) => {
                console.log('first', first);
                console.log('second', second);
                if (second.pixelFraction < first.pixelFraction) {
                    return -1;
                }
                return 1;
            })
            .map(color => {
                const c = `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`;
                return (
                    <div key={'dominant-colors-' + i++} className={'color--wrapper'}>
                        <div className={'color__div'} style={{ backgroundColor: c }}/>
                        <div className={'color__info'}>
                            Color: #{rgbToHex(color.color.red)}{rgbToHex(color.color.green)}{rgbToHex(color.color.blue)}<br/>
                            Score: {color.score.toFixed(4)}<br/>
                            Pixel Fraction: {color.pixelFraction.toFixed(4)}
                        </div>
                    </div>
                );
            });
        return (
            <>
                <h2>Dominant Colors</h2>
                {colors}
            </>
        );
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
                    this.setState({ data: response.data, image: reader.result.toString() });
                }).catch(error => {
                console.log('Error:', error);
            });
        };
    };

    getImage = () => {
        if (!this.state.image) {
            return null;
        }
        const type = this.state.image.toString().search('jpeg') === -1 ? 'png' : 'jpeg';
        const image = this.state.image.toString().replace(`data:image/${type};base64,`, '');
        return (
            <div className={'image'}>
                <h2>Uploaded image</h2>
                <img src={`data:image/jpeg;base64,${image}`} alt={'Uploaded'}/>
            </div>
        );
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
                {this.getImage()}
            </main>
        );
    }
}
