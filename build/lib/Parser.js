"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param  {ParserOptions} options
 */
class Parser {
    constructor(options = {}) {
        this.defaultCommands = ["reply", "areply"];
        this.defaultAliases = ["anonreply", "anonymousreply"];
        this.useDefaultCommandNames = options.useDefaultCommandNames || true;
        this.useDefaultAliases = options.useDefaultAliases || true;
        this.customAliases = options.customAliases || [];
        this.parsedAliases = [];
    }
    ;
    /**
     * Parse Function
     *
     * @param {Aliases} aliases
     * @return {*}  {string[]}
     * @memberof Parser
     */
    parse(aliases) {
        const commandsToCheck = [];
        if (this.useDefaultCommandNames)
            commandsToCheck.push(...this.defaultCommands);
        if (this.useDefaultAliases)
            commandsToCheck.push(...this.defaultAliases);
        if (this.customAliases && this.customAliases.length > 0)
            commandsToCheck.push(...this.customAliases);
        this.getAliasesForCommands(aliases, commandsToCheck);
        if (this.parsedAliases.length > 0)
            commandsToCheck.push(...this.parsedAliases);
        console.log(commandsToCheck);
        let replies = [];
        for (const [, command] of Object.entries(aliases)) {
            if (command.includes("&&")) {
                const multiAliases = command.split("&&");
                for (const alias of multiAliases) {
                    const check = this.getContent(alias, commandsToCheck);
                    if (check)
                        replies.push(check);
                }
            }
            else {
                const check = this.getContent(command, commandsToCheck);
                if (check)
                    replies.push(check);
            }
        }
        return replies;
    }
    ;
    /**
     * Get the contents of the alias
     *
     * @private
     * @param {string} command
     * @param {string[]} toCheck
     * @return {*}  {(string | null)}
     * @memberof Parser
     */
    getContent(command, toCheck) {
        const splitCommand = command.replace("\"", "").split(" ");
        if (toCheck.includes(splitCommand[0]))
            return splitCommand.slice(1).join(" ");
        return null;
    }
    /**
     * This funtion is called first in the [parse]{@link Parser#parse} function.
     *
     * @private
     * @memberof Parser
     */
    getAliasesForCommands(aliases, commandsToCheck) {
        for (const [alias, command] of Object.entries(aliases)) {
            if (commandsToCheck.includes(command))
                this.parsedAliases.push(alias);
        }
    }
}
;
exports.default = Parser;
//# sourceMappingURL=Parser.js.map