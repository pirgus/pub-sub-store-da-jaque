const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var report = {}

async function processMessage(msg) {
    console.log('processando mensagem...')
    const data = JSON.parse(msg.content)
    try {
        console.log('entrou no try ?')
        console.log(`${data}`)
        updateReport(data)
        printReport()

    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.response}`)
    }
}

async function updateReport(products) {
    for(let product of products) {
        if(!product.name) {
            continue
        } else if(!report[product.name]) {
            report[product.name] = 1;
        } else {
            report[product.name]++;
        }
    }
}

async function printReport() {
    for (const [key, value] of Object.entries(report)) {
        console.log(`${key} = ${value} vendas`);
      }
}

async function consume() {
    console.log(`Inscrito com sucesso na fila: ${process.env.RABBITMQ_QUEUE_NAME} `) 
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()
