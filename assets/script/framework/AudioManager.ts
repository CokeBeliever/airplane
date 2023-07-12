import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


interface IAudioMap {
    [name: string]: AudioClip;
}

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property([AudioClip])
    public audioList: AudioClip[] = [];

    private _dist: IAudioMap = {};

    private _audioSource: AudioSource = null;
    
    start() {
        for (let i = 0; i < this.audioList.length; i++) {
            const element = this.audioList[i];
            this._dist[element.name] = element;
        }

        this._audioSource = this.getComponent(AudioSource);
    }

    update(deltaTime: number) {}

    play(name: string) {
        const audioClip = this._dist[name];
        if (audioClip) {
            this._audioSource.playOneShot(audioClip);
        }
    }
}


