const {select, input , checkbox} = require('@inquirer/prompts') 
// select seleciona/escolhe a opção // input recebe uma inserção do usuário // checkbox permite marcar uma ou mais opções
const fs = require('fs').promises

let mensagem = 'Bem Vinda ao app de metas'
let metas

const carregarMetas = async () => {
    try{
        //a contante dados esta esperando a execução da função do fs: lerArquivo.
        //o arquivo que esta sendo lido é o "metas.json" do tipo de caracter mais comum o "utf-8"
        const dados = await fs.readFile("metas.json" , "utf-8")
        //metas esta recebendo como argumento os dados lidos acima que estão sendo convertidos 
        //em array através da função do JSON "parse"
        metas = JSON.parse(dados)
    }
    //caso a tentativa dê errado, o chatch retorna a variavel metas como array vazio
    catch(erro){
        metas = []
    }
}
// esta função
const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
     const meta = await input({message: "Digite a meta:"})

        if(meta.length == 0){
            mensagem = 'A meta não pode ser vazia'
            return
        }
        metas.push(
            {value: meta , checked: false }
        )
        mensagem = 'Meta cadastrada com sucesso!'
}

const listarMetas = async () => {
    //respostas é a seleção de metas
    const respostas = await checkbox({
        message: 'Use as setas para mudar de meta, espaço para marcar ou desmarcar e o enter para finalizar a etapa',
        //spread/rest operator: ...
        choices: [...metas],
        //instructions esta false para mostar apenas as intruçoes em portugues no message
        instructions: false
    })
    //essa função vai marcar todas as metas como false(desmarcar todas as metas)
    //colocar essa função desmarcar antes do if para que não ocorra o erro de 
    //não conseguir desmarcar
    metas.forEach((m)=> {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada"
        return
    }
    //esta função vai usar o metodo 'paraCada' vai comparar cada resposta da const respostas
    // usando o metodo 'find' da função meta para retornar o value da resposta compatível
    // e marcar como true 
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    mensagem = 'Metas marcadas como concluídas!'
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0){
        mensagem = 'Não existem metas realizadas :('
        return
    }
    await select({
        message: 'Metas realizadas:',
        //neste caso o spread operator está pegando o array "realizadas" gerado após a execução
        //do metodo "filter"e colocando dentro do array que esta no choices
        choices: [...realizadas]
    })
}
//esta é uma função assincrona que recebe a constante "abertas" como argumento que é um array
//que esta recebendo o metodo "filter" que é uma higer order function(metodo que recebe uma funçao)
//para retornar as metas com checked != de true
const metasAbertas = async () => {
    const  abertas = metas.filter((meta) => {
        //return !metas.checked
        return meta.checked != true
    }) 
    if(abertas.length == 0){
        mensagem = 'Não existem metas abertas :)'
        return
    }
    await select({
        message: 'Metas Abertas:',
        choices: [...abertas]
    })
}

const deletarMeta = async () => {
    //a hof map cria um novo array com modificações
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    //esta função esta criando um array(metasADeletar), que estará armazenando o array metasDesmarcadas,
    //para marcar(checkbox) as metas que deseja deletar
      const metasADeletar = await checkbox({
        message: 'Selecione a meta que deseja deletar',
        choices: [...metasDesmarcadas],
        //instructions esta false para mostar apenas as intruçoes em portugues no message
        instructions: false
    })
    if(metasADeletar.length == 0){
        mensagem = 'Nenhuma meta para deletar'
        return
    }
    //forEach item do array metasADeletar será realizado a função filter que irá comparar
    //o valor da meta com o item selecionado para deletar, caso o valor da meta seja diferente
    // do item a meta permanecerá no array 'metas' que contem todas as metas cadastradas
    metasADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensagem = 'Metas deletadas com sucesso!'
}
//esta função esta limpando o terminal
//se a mensagem for diferente de string vazio irá mostrar a mensagem 
const mostrarMensagem = async () => {
    console.clear()
    if(mensagem != '' ){
        console.log(mensagem)
        //quebra de linha 
        console.log('')
        //mensagem volta a ser string vazio
        mensagem = ''
    }
}

const start = async () => {
    await carregarMetas()
    while(true) {
         mostrarMensagem()
         await salvarMetas()
        const opcao = await select({
            message: 'Menu',
            choices: [
            {   
                name: 'Cadastrar Meta',
                value: 'cadastrar'
            },
            {
                name: 'Listar Metas',
                value: 'listar'
            },
            {
                name: 'Metas Realizadas',
                value: 'realizadas'
            },
            {
                name: 'Metas Abertas',
                value: 'abertas'
            },
            {
                name: 'Deletar Metas',
                value: 'deletar'
            },
            {
                name: 'Sair',
                value: 'sair'
            }]
        })
        switch(opcao) {
            case 'cadastrar': 
            await cadastrarMeta()
                break
            case 'listar':
                await listarMetas()
                break
            case 'realizadas':
                await metasRealizadas()
                break
            case 'abertas':
                await metasAbertas()
                break
            case 'deletar':
                await deletarMeta()
                break
            case 'sair':
                console.log('Até a próxima!')
                return
        }
    }
}

start()