import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'enable',
            description: 'يرجع امر لحالة الاستعمال',
            category: 'dev',
            dm: true,
            usage: `${client.config.prefix}enable [command]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid)) return void null
        const key = joined.toLowerCase().trim()
        if (!key) return void (await M.reply(`اكتب الامر الي تبيه يشتغل`))
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void (await M.reply(`No command found`))
        if (!(await this.client.DB.disabledcommands.findOne({ command: command.config.command })))
            return void M.reply(`${this.client.util.capitalize(command.config.command)} اصلا مشتغل`)
        await this.client.DB.disabledcommands.deleteOne({ command: command.config.command })
        await M.reply(`*${this.client.util.capitalize(command.config.command)}* اشتغل`)
    }
}
