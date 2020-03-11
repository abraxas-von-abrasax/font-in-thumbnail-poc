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
        loading: false,
        dataSet: null,
        currentData: null,
        image: null
    };

    changeData = resolution => {
        this.setState({
            currentData: this.state.dataSet[resolution],
            image: this.state.dataSet[resolution].imageUrl
        })
    };

    getDataSet = () => {
        if (!this.state.dataSet || this.state.dataSet === {}) {
            return null;
        }

        const dataSetElements = Object.keys(this.state.dataSet).map(resolution => {
            return (
                <span key={resolution} className={'data-set__element'} onClick={() => this.changeData(resolution)}>
                    {resolution}
                </span>
            );
        });
        return (
            <div className={'data-set'}>
                <h2>Thumbnail Sizes</h2>
                <div>
                    {dataSetElements}
                </div>
            </div>
        );
    };

    getData = () => {
        if (
            !this.state.currentData.fullTextAnnotation &&
            (!this.state.currentData.textAnnotations || !this.state.currentData.textAnnotations.length) &&
            !this.state.currentData.dominantColors
        ) {
            return <div>Visions API did not return any data for this image.</div>
        }
        return (
            <div>
                <FullPageAnnotationsResult fullTextAnnotation={this.state.currentData.fullTextAnnotation}/>
                <DominantColorsResult dominantColors={this.state.currentData.dominantColors}/>
                <TextAnnotationsResult textAnnotations={this.state.currentData.textAnnotations}/>
            </div>
        );
    };

    processFile = file => {
        this.setState({ loading: true });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            axios.post(config.backend.url, { image: encodeURIComponent(reader.result.toString()) })
                .then(response => {
                    this.setState({
                        loading: false,
                        dataSet: null,
                        currentData: response.data,
                        image: reader.result.toString()
                    });
                }).catch(error => {
                console.error('Error:', error);
                this.setState({
                    loading: false,
                    dataSet: null,
                    currentData: null,
                    image: null
                })
            });
        };
    };

    processUrl = url => {
        this.setState({ loading: true });
        axios.get(`${config.backend.url}/url/${encodeURIComponent(url)}`)
            .then(response => {
                this.setState({
                    loading: false,
                    dataSet: response.data,
                    currentData: response.data.default,
                    image: response.data.imageUrl
                });
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({
                    loading: false,
                    dataSet: null,
                    currentData: null,
                    image: null
                })

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
        let dataSet = null;

        if (this.state.dataSet) {
            dataSet = this.getDataSet();
        }

        let content = <div className={'loading'}>Loading...</div>;

        if (!this.state.loading) {
            let data = null;
            if (this.state.currentData) {
                data = this.getData();
            }

            content = (
                <>
                    {dataSet}
                    {data}
                    {this.getImage()}
                </>
            );
        }

        return (
            <main>
                <h1>Image Analyzer</h1>
                <DataInput onFileSubmit={this.processFile} onUrlSubmit={this.processUrl}/>
                {content}
            </main>
        );
    }
}
