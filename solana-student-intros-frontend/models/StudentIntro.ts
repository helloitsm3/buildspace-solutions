import * as borsh from '@project-serum/borsh'

export class StudentIntro {
    name: string;
    message: string;

    constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }

    static mocks: StudentIntro[] = [
        new StudentIntro('Elizabeth Holmes', `Learning Solana so I can use it to build sick NFT projects.`),
        new StudentIntro('Jack Nicholson', `I want to overhaul the world's financial system. Lower friction payments/transfer, lower fees, faster payouts, better collateralization for loans, etc.`),
        new StudentIntro('Terminator', `i'm basically here to protect`),
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }
}