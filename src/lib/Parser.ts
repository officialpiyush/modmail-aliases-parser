/**
 * @param  {ParserOptions} options
 */
class Parser {
    private readonly defaultCommands = ["reply", "areply"];
    private readonly defaultAliases = ["anonreply", "anonymousreply"];
    private customAliases: string[];
    private parsedAliases: string[];
    private useDefaultCommandNames: boolean;
    private useDefaultAliases: boolean;

    constructor(options: ParserOptions = {}) {
        this.useDefaultCommandNames = options.useDefaultCommandNames || true;
        this.useDefaultAliases = options.useDefaultAliases || true;
        this.customAliases = options.customAliases || [];
        this.parsedAliases = [];
    };

    /**
     * Parse Function
     *
     * @param {Aliases} aliases
     * @return {*}  {string[]}
     * @memberof Parser
     */
    public parse(aliases: Aliases): Array<string> {
        const commandsToCheck: string[] = [];

        if (this.useDefaultCommandNames) commandsToCheck.push(...this.defaultCommands);
        if (this.useDefaultAliases) commandsToCheck.push(...this.defaultAliases);
        if (this.customAliases && this.customAliases.length > 0) commandsToCheck.push(...this.customAliases);

        this.getAliasesForCommands(aliases, commandsToCheck);
        if (this.parsedAliases.length > 0) commandsToCheck.push(...this.parsedAliases);

        console.log(commandsToCheck);


        let replies = [];
        for (const [, command] of Object.entries(aliases)) {
            if (command.includes("&&")) {
                const multiAliases = command.split("&&");

                for (const alias of multiAliases) {
                    const check = this.getContent(alias, commandsToCheck);
                    if (check) replies.push(check);
                }
            } else {
                const check = this.getContent(command, commandsToCheck);
                if (check) replies.push(check);
            }
        }

        return replies;
    };

    /**
     * Get the contents of the alias
     *
     * @private
     * @param {string} command
     * @param {string[]} toCheck
     * @return {*}  {(string | null)}
     * @memberof Parser
     */
    private getContent(command: string, toCheck: string[]): string | null {
        const splitCommand = command.replace("\"", "").split(" ");
        if (toCheck.includes(splitCommand[0])) return splitCommand.slice(1).join(" ");

        return null;
    }

    /**
     * This funtion is called first in the [parse]{@link Parser#parse} function.
     *
     * @private
     * @memberof Parser
     */
    private getAliasesForCommands(aliases: Aliases, commandsToCheck: string[]) {
        for (const [alias, command] of Object.entries(aliases)) {
            if (commandsToCheck.includes(command)) this.parsedAliases.push(alias);
        }
    }
};

export default Parser;