import * as React from 'react';
import './App.css';
import { config } from './utils/config';
import axios from 'axios'
import { DataInput } from './components/data-input';
import { DominantColorsResult } from './components/dominant-colors-result';
import { TextAnnotationsResult } from './components/text-annotations-result';
import { FullPageAnnotationsResult } from './components/full-page-annotations-result';

export class App extends React.PureComponent {
    state = {
        data: null,
        image: null
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
                <FullPageAnnotationsResult fullTextAnnotation={this.state.data.fullTextAnnotation}/>
                <DominantColorsResult dominantColors={this.state.data.dominantColors}/>
                <TextAnnotationsResult textAnnotations={this.state.data.textAnnotations}/>
            </div>
        );
    };

    processFile = file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            axios.post(config.backend.url, { image: encodeURIComponent(reader.result.toString()) })
                .then(response => {
                    this.setState({ data: response.data, image: reader.result.toString() });
                }).catch(error => {
                console.error('Error:', error);
            });
        };
    };

    processUrl = url => {
        axios.get(`${config.backend.url}/url/${encodeURIComponent(url)}`)
            .then(response => {
                this.setState({ data: response.data, image: response.data.imageUrl });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    getImage = () => {
        if (!this.state.image) {
            return null;
        }

        let imageSrc;

        if (typeof this.state.image === 'string') {
            imageSrc = this.state.image;
        } else {
            const type = this.state.image.toString().search('jpeg') === -1 ? 'png' : 'jpeg';
            const image = this.state.image.toString().replace(`data:image/${type};base64,`, '');
            imageSrc = `data:image/jpeg;base64,${image}`;
        }
        return (
            <div className={'image'}>
                <h2>Uploaded image</h2>
                <img src={imageSrc} alt={'Uploaded'}/>
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
                <DataInput onFileSubmit={this.processFile} onUrlSubmit={this.processUrl}/>
                {data}
                {this.getImage()}
            </main>
        );
    }
}
