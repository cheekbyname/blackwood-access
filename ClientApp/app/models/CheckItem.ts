export class CheckItem {
	itemId: number;
	itemName: string;
	value: string;
	furtherValue: string;
	furtherTitle: string;
	further: string;
	
	constructor(itemId: number, itemName: string, furtherValue?: string, furtherTitle?: string) {
		this.itemId = itemId;
		this.itemName = itemName;
		this.furtherValue = furtherValue;
		this.furtherTitle = furtherTitle;
	}
}
