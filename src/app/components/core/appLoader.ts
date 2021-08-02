export default class AppLoader extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode:'open'}) as ShadowRoot 
        shadowRoot.innerHTML = `
          <style>
              :host-context(.fade-app-loader) {
                visibility: visible;
                transition: visibility 0s, opacity 0.5s linear;
                opacity: 0;
              }
              .lds-ellipsis {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
                opacity: 0.5;
              }
              .lds-ellipsis div {
                position: absolute;
                top: 33px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #fff;
                animation-timing-function: cubic-bezier(0, 1, 1, 0);
              }
              .lds-ellipsis div:nth-child(1) {
                left: 16px;
                animation: lds-ellipsis1 0.6s infinite;
              }
              .lds-ellipsis div:nth-child(2) {
                left: 16px;
                animation: lds-ellipsis2 0.6s infinite;
              }
              .lds-ellipsis div:nth-child(3) {
                left: 40px;
                animation: lds-ellipsis2 0.6s infinite;
              }
              .lds-ellipsis div:nth-child(4) {
                left: 64px;
                animation: lds-ellipsis3 0.6s infinite;
              }
              @keyframes lds-ellipsis1 {
                0% {
                  transform: scale(0);
                }
                100% {
                  transform: scale(1);
                }
              }
              @keyframes lds-ellipsis3 {
                0% {
                  transform: scale(1);
                }
                100% {
                  transform: scale(0);
                }
              }
              @keyframes lds-ellipsis2 {
                0% {
                  transform: translate(0, 0);
                }
                100% {
                  transform: translate(24px, 0);
                }
              }

          </style>
          <div id="app-loader"
              style="display: flex;
              visibility: visible;
              opacity: 1;
              justify-content: center;
              align-items: center;
              position: fixed; 
              left: 0; 
              top: 0; right: 
              0; bottom: 0; 
              background: rgb(0, 0, 0, 0.4);">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>`
        this.appLoaderElem = shadowRoot.children[1] as HTMLElement
    }

    appLoaderElem:HTMLElement

    disable (){
      const elem = document.getElementById('app') as HTMLElement 
      elem.classList.add('fade-app-loader')
    }
}

customElements.define('app-loader', AppLoader);