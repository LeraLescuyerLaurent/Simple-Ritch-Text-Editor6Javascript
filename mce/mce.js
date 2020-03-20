const mceEditor = new (function () {
    const self = this;

    self.init = function (args) {

        loadIcons();


        // cache le textarea
        document.getElementById(args.selector).style.display ='none';

        const defaultElements = [
            {command: 'formatBlock', type: 'select', innerHTML: '',options: ['H2', 'H3', 'H4', 'P'] },
            {command: 'bold', type: 'button', innerHtml: '<i class="fas fa-bold"></i>' },
            {command: 'italic', type: 'button', innerHtml: '<i class="fas fa-italic"></i>' },
            {command: 'underLine', type: 'button', innerHtml: '<i class="fas fa-underline"></i>' },
            {command: 'strikeThrough', type: 'button', innerHtml: '<i class="fas fa-strikethrough"></i>' },
            {command: 'justifyFull', type: 'button', innerHtml: '<i class="fas fa-align-justify"></i>' },
            {command: 'justifyLeft', type: 'button', innerHtml: '<i class="fas fa-align-left"></i>' },
            {command: 'justifyCenter', type: 'button', innerHtml: '<i class="fas fa-align-center"></i>' },
            {command: 'justifyRignt', type: 'button', innerHtml: '<i class="fas fa-align-right"></i>' },
            {command: 'insertUnorderedList', type: 'button', innerHtml: '<i class="fas fa-list-ul"></i>' },
            {command: 'insertOrderedList', type: 'button', innerHtml: '<i class="fas fa-list-ol"></i>' },
            {command: 'indent', type: 'button', innerHtml: '<i class="fas fa-indent"></i>' },
            {command: 'outdent', type: 'button', innerHtml: '<i class="fas fa-outdent"></i>' },
            {command: 'createLink', type: 'button', innerHtml: '<i class="fas fa-link"></i>' },
            {command: 'unLink', type: 'button', innerHtml: '<i class="fas fa-unlink"></i>' },
            {command: 'insertImage', type: 'button', innerHtml: '<i class="fas fa-image"></i>' },
            {command: 'enableObjectResizing', type: 'button', innerHtml: '<i class="fas fa-vector-square"></i>'  },
            {command: 'viewSourceCode', type: 'button', innerHtml: '<i class="fas fa-code"></i>' },
        ];
        // Création du container
        let container = document.createElement('div');
        container.setAttribute('id' , 'mceEditorFieldContainer');
        container.appendAfter(document.getElementById(args.selector));
        

        // création de l iframe
        const contentEditable = document.createElement('iframe');
        contentEditable.setAttribute('name', 'mceEditorField');
        contentEditable.setAttribute('id', 'mceEditorField');
        contentEditable.style.width = '100%';
        contentEditable.style.minHeight = '80vh';
        contentEditable.style.minHeight = '80vh';


        contentEditable.style.border = "1px solid lightgrey";
        
        container.appendChild(contentEditable);
      
        
       

        // Pour firefox ouvir et fermer le document permet de résoudre le bug designMode
       contentEditable.contentWindow.document.open();
      
       contentEditable.contentWindow.document.close();
    //    permet d'écrire dans la iframe
        contentEditable.contentDocument.designMode = 'On';



      
        // Création des boutons de controle
        for (var el = 0 in defaultElements) {
            
            let thisElement ;
            let element = document.createElement(defaultElements[el].type);
            
            element.setAttribute('title', defaultElements[el].command);

            element.innerHTML = defaultElements[el].innerHtml;
            element.style.margin = "0 5px 0 0";
            element.style.padding = "0 5px";

            let command;
            let argument = null;

            if (defaultElements[el].type.indexOf('button') !== -1) {
                let showCode= false;
                let isPrompt = false;

                    element.onclick = function (e) {
                        e.preventDefault();
                        let  command = this.getAttribute('title');
                        if (command == 'viewSourceCode') {
                            showCode = execViewSourceCommand(element, contentEditable, showCode);
                        }else{
                            switch (command){
                                case 'insertImage':
                                    var element = document.getElementById("modal");
                                    element.classList.remove("modalNone");
                                    // argument = prompt('enter your url');
                                    // isPrompt = true;
                                    break;
                                case 'createLink':
                                    argument = prompt('enter ypur link');
                                    isPrompt = true;
                                    break;
                            }
                            // if ((argument !== null && isPrompt) || !isPrompt) {
                                // mceEditorField.document.execCommand(command, false, argument);
                            }
                        }
                    };
            }else{ 
                // ci c'est pas un button
                if (isThisElement(defaultElements[el], 'formatBlock')) {
                    for (var op in defaultElements[el].options) {
                        let opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(defaultElements[el].options[op]));
                        opt.value =defaultElements[el].options[op];
                        element.appendChild(opt);
                    }
                }
                element.onchange = function(){
                    command = this.getAttribute('title');
                    mceEditorField.document.execCommand(command, false, this.value)
                }
            }
            
            if (el < 0) {
                thisElement = element;
            }
            
            
            if (el < 0) {
                element.appendAfter(thisElement)
            }else{
                element.appendBefore(contentEditable);
            }
        }
        
        
    };
    
    Element.prototype.appendBefore = function(element) {
        element.parentNode.insertBefore(this, element)
    },false;
    Element.prototype.appendAfter = function(element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    },false;

// récup la position du curseur


    const loadIcons = function () {
        let scriptsrc = document.createElement('script');
        scriptsrc.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/js/all.min.js';
        document.head.appendChild(scriptsrc);
    }


    function isThisElement(defaultElements, v){
        return defaultElements.command.indexOf(v) !== -1;
    }

    function execViewSourceCommand(element, contentEditable, showCode){
        elemGet =  contentEditable.contentDocument.getElementsByTagName('body');
            if (!showCode) {
                elemGet[0].textContent = elemGet[0].innerHTML;
                showCode = true;
            }else{
                elemGet[0].innerHTML = elemGet[0].textContent;
                showCode = false;
            }

            return showCode;
    }
});