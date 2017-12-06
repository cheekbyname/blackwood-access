import { Region } from "./Region";

export class Email {
    public id: number;
    public regionId: number;
    public address: string;

    public region: Region;
}