const {select, input , checkbox} = require('@inquirer/prompts') 
// select seleciona/escolhe a opção // input recebe uma inserção do usuário // checkbox permite marcar uma ou mais opções
let meta = {
    value:'Beber 3 litros de agua por dia', 
    checked: false
}
let metas = [ meta ]

const cadastrarMeta = async () => {
     const meta = await input({message: "Digite a meta:"})

        if(meta.length == 0){
            console.log('A meta não pode ser vazia')
            return
        }
        metas.push(
            {value: meta , checked: false }
        )
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
        console.log("Nenhuma meta selecionada")
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
    console.log('Metas marcadas como concluídas!')
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if(realizadas.length == 0){
        console.log('Não existem metas realizadas :(')
        return
    }
    await select({
        message: 'Metas realizadas',
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
        return meta.chacked != true
    }) 
    if(abertas.length == 0){
        console.log('Não existem metas abertas :)')
        return
    }
    await select({
        message: 'Metas Abertas',
        choices: [...abertas]
    })
}


const start = async () => {
    while(true) {

        const opcao = await select({
            message: 'Menu',
            choices: [
            {
                name: 'Cadastrar meta',
                value: 'cadastrar'
            },
            {
                name: 'Listar metas',
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
                name: 'Sair',
                value: 'sair'
            }
            ]
        })
        switch(opcao) {
            case 'cadastrar': 
            await cadastrarMeta()
                console.log(metas)
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
            case 'sair':
                return
        }
    }
}

start()