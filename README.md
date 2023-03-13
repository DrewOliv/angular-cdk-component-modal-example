E aí, pessoal! Já pensou em criar suas própria modal para suas aplicações web sem se preocupar com bibliotecas de terceiros? Com o `@angular/cdk`, podemos tornar essa tarefa muito mais fácil.

O `@angular/cdk` contém vários componentes prontos para uso, como o `Overlay` e o `Portal`, que ajudam muito na criação de modais personalizadas.

Neste artigo, vou te mostrar como criar uma modal personalizada usando o `@ViewChild` e `@ViewChild`. Então, pegue seu café e vamos ao código 👨‍💻

## Pré-requisitos:

Para acompanhar este tutorial, você precisará de um projeto Angular e ter um breve conhecimento sobres os conceitos do Angular.

**Atenção! Este tutorial foi criado usando Angular 15, mas com um pouco de esforço, é possível implementá-lo em versões anteriores do Angular.**

### É Hora de implementar

Para iniciar, é necessário instalar o pacote `@angular/cdk` através do comando npm `install @angular/cdk` ou utilizar a opção `ng add @angular/cdk` fornecida pelo `@angular/cli`. É importante também incluir os estilos disponíveis do `@angular/cdk` no seu arquivo de CSS global.

```css
@import "@angular/cdk/overlay-prebuilt.css";
```

Para criar o nosso componente modal utilizando o `@angular/cli`, execute o seguinte comando no terminal dentro do diretório do seu projeto:

```sh
ng g c modal
```

após gerar nosso component via `@angular/cli` devemos ter algo assim:

```ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
  standalone: true,
})
export class ModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
```

Ótimo! Vamos começar criando uma variável chamada `MODAL_DEFAULT_OPTIONS` com alguns valores padrão. Nela, definimos o positionStrategy como `GlobalPositionStrategy`, o que fará com que o Overlay trabalhe com o posicionamento relativo à janela do navegador. Em seguida, chamamos os métodos `centerHorizontally()` e `centerVertically()` para alinhar nossa modal ao centro da tela.

Também definimos que a modal terá um fundo `hasBackdrop` e adicionamos uma `class` personalizada chamada `modal-panel` para nosso painel. Por fim, definimos uma largura mínima para nossa modal de `500px`.

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

O próximo passo é criar um `ng-template` em nosso arquivo HTML e incluir algumas tags HTML para ajudar a estruturar nossa modal:

Criamos um `ng-template` e demos a ele um nome de referência `#modalTemplate`.
Criamos uma div para agrupar nossos elementos.
Adicionamos um `ng-content` com o select `[modal--content]`.

```html
<ng-template #modalTemplate>
  <div class="modal">
    <ng-content select="[modal--content]"></ng-content>
  </div>
</ng-template>
```

Vamos criar um `ng-template` para que o conteúdo seja chamado apenas quando criarmos nossa modal utilizando o `TemplatePortal`.

O `TemplatePortal` é uma classe do `@angular/cdk/portal` que nos permite inserir conteúdo em um componente ou elemento de destino.

Agora que já temos o nosso template definido no HTML, vamos criar uma variável e utilizar o decorator `@ViewChild`, passando o nome que demos ao nosso template no HTML. Além disso, vamos criar uma variável chamada `overlayRef` para controlar a exibição da nossa modal.

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
import "zone.js/dist/zone";
import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { ModalComponent } from "./modal/modal.component";

@Component({
  selector: "my-app",
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
  @ViewChild("modal") modal: ModalComponent;

  name = "Angular";

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
import "zone.js/dist/zone";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { ModalComponent } from "./modal/modal.component";

@Component({
  selector: "my-app",
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
  name = "Angular";
}

bootstrapApplication(App);
```

🥳 Parabéns! Agora você tem em mãos uma modal reutilizável que pode ser implementada em seus projetos ou até mesmo em uma biblioteca de componentes (design system).
Lembre-se de considerar as necessidades do seu projeto e manter uma documentação clara e atualizada para facilitar o uso por outros membros da equipe.

Além disso, você pode acessar o repositório no Github e o exemplo no Stackblitz para consultar o código e ter mais informações sobre a implementação da modal.

🌐 repository: https://github.com/DrewOliv/angular-cdk-component-modal-example
💻 stackblitz: https://stackblitz.com/edit/angular-qhsjku?file=README.md
