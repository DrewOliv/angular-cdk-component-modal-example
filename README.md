E aí, pessoal! Já imaginou criar suas próprias modais para suas aplicações web? Isso mesmo, sem precisar se preocupar com bibliotecas de terceirosl! Com @angular/cdk, conseguimos tornar essa tarefa muito mais fácil.

O @angular/cdk contém vários componentes prontos para uso, como o Overlay e o Portal, que vão ajudar muito na criação de suas modais personalizadas.

E adivinha só? Neste artigo, eu vou te mostrar como criar uma modal personalizada usando o @angular/cdk e @ViewChild. Então, pegue o seu café vamos e vamos ao código 👨‍💻 

## Pré-requisitos:

Para acompanhar este tutorial, você precisará de um projeto Angular e ter um breve conhecimento sobres os conceitos do Angular.

## É Hora de implementar
Vamos começar instalando o @angular/cdk, podemos fazer isso via `npm install @angular/cdk` ou utilizar o comando que o @angular/cli disponibiliza `ng add @angular/cdk`.

devemos também incluir estilos do que o @angular/cdk disponibiliza em nosso arquivo de css global

```css
@import '@angular/cdk/overlay-prebuilt.css';
```

agora que temos o cdk instalado vamos criar o nosso component modal, para isso iremos utilizar o @angular/cli

```sh
ng g c modal
```

após gerar nosso component via @angular/cli devemos ter algo assim:

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
})
export class ModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

Certo! vamos começar criando uma variavel `MODAL_DEFAULT_OPTIONS` com alguns valores default.

```ts
export const MODAL_DEFAULT_OPTIONS: OverlayConfig = {
  positionStrategy: new GlobalPositionStrategy()
    .centerHorizontally()
    .centerVertically(),
  hasBackdrop: true,
  panelClass: "modal-panel",
  minWidth: "500px",
};
```

Nessa variável vamos definir o `positionStrategy` como `GlobalPositionStrategy`. Isso fará com que o Overlay trabalhe com o posicionamento relativo à janela do navegador. Além disso, chamamos os seguintes métodos: `centerHorizontally()` e `centerVertically()`, para alinharmos o nossa modal ao centro da tela.

Também definimos que a modal terá um `hasBackdrop` (fundo) e adicionamos uma `class` personalizada  `modal-panel` para o nosso painel. E, por fim, definimos uma largura mínima para nossa modal `500px`.

O proximo passo é criamos um `ng-template` em nosso arquivo html, vamos aproveitar também para incluir alguns tags html que vão nos ajudar a estruturar nossa modal.

- criamos um `ng-template` e demos um nome de referencia a ele `#modalTemplate` 
- criamos uma `div` apenas para agrupar nossos elementos 
- criamos um `ng-content` e definimos o select `[modal--content]` 

```html
<ng-template #modalTemplate>
  <div class="modal">
    <ng-content select="[modal--content]"></ng-content>    
  </div>
</ng-template>
```

criamos um `ng-template` pois so queremos que o contéudo dele seja chamado, quando criarmos nossa modal, faremos isso utilizando o `TemplatePortal`.

O TemplatePortal é uma classe do `@angular/cdk/portal` que nos permite inserir conteúdo em um componente ou elemento de destino.

agora que ja temos o nosso template defindo no html vamos criar uma variavel e utilzarmos do decorator `@ViewChild` passando o 'nome' que demos ao nosso template no html, também iremos criar uma variavel chamada `overlayRef`

```ts
 @ViewChild("modalTemplate") modalTemplate: TemplateRef<any>;

 private overlayRef: OverlayRef;
```

no `constructor` do nosso component vamos injetar o `viewContainerRef` e o `overlay`

```ts
constructor(
    private _viewContainerRef: ViewContainerRef,
    private overlay: Overlay
  ) {}
```

**criamores agora o metodo que ira abrir a modal, vamos chamar ele de `open()`**

Primeiramente, o método `open()` cria uma overlayRef utilizando a função create() do `overlay`, que recebe como parâmetro um objeto contendo as opções para a modal. Essas opções foram definidas através do `MODAL_DEFAULT_OPTIONS`.

em seguida, é criado um containerModal utilizando o `TemplatePortal`, que é uma classe que permite criar um `portal` para o conteúdo de um `ng-template`. O `containerModal` é criado a partir do `modalTemplate`, que é definido em um `ng-template` no arquivo HTML. O `TemplatePortal` também recebe como parâmetro o viewContainerRef, que é uma referência para o container da view do Angular.

por fim, a `overlayRef` é anexada ao containerModal utilizando a função `attach()`, que recebe como parâmetro o `containerModal`. A função `open()` retorna a `overlayRef`, que pode ser utilizada para fechar a modal posteriormente.

```ts
public open() {
    this.overlayRef = this.overlay.create({
      ...MODAL_DEFAULT_OPTIONS,
    });

    const containerModal = new TemplatePortal(
      this.modalTemplate,
      this._viewContainerRef
    );

    this.overlayRef.attach(containerModal);

    return this.overlayRef;
}
```
 
Agora método `close()` ele é responsável por fechar a modal. Ele simplesmente chama o método `dispose()` no `overlayRef`, o que faz com que a modal seja removida da tela 

```ts
public close() {    
    this.overlayRef.dispose();
}
```

agora em nosso arquivo de scss global vamos incluir um estilo para nossa modal

```css
.modal-panel {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
}
```

Otimo! finalizamos a implementação da nossa modal, agora vamos utilizar.

Para utilizar o componente `ModalComponent`, podemos criar um botão que chama o método open() e um outro botão dentro da modal que chama o método close(). Podemos utilizar a referência do componente utilizando o decorator `@ViewChild`.

```ts
import 'zone.js/dist/zone';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: ` 
  
    <button (click)="modalOpen()">Abrir modal</button>

    <app-modal #modal>
      <div modal--content>
        <p>modal</p>
        <button (click)="modalClose()">Fechar</button>
      </div>
    </app-modal>
  `,
})
export class App {
  @ViewChild('modal') modal: ModalComponent;

  name = 'Angular';

  modalOpen() {
    this.modal.open();
  }

  modalClose() {
    this.modal.close();
  }
}

bootstrapApplication(App);
```

ou

```ts
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `   
    <button (click)="modal.open()">Abrir modal</button>

    <app-modal #modal>
      <div modal--content>
        <p>modal</p>
        <button (click)="modal.close()">Fechar modal</button>
      </div>
    </app-modal>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
```