import Dialog from "./dialog/Dialog"
import Updateable from "./Updateable"

export default class DialogHost {

    dialogs: Array<Dialog>

	constructor(private updateable:Updateable) {
		this.dialogs = []
	}

	update() {
		this.updateable.update()
	}

    openDialog(dialog:Dialog): void {

        //this.dialogs.push(new SubTree(dialog))
        this.dialogs.push(dialog)
        this.update()

    }

    closeDialog(dialog:Dialog): void {

        const i:number = this.dialogs.indexOf(dialog)

        this.dialogs.splice(i, 1)

        dialog.onClose.fire(undefined)

        if(dialog.parent) {

            const parentI = dialog.parent.children.indexOf(dialog)

            dialog.parent.children.splice(parentI, 1)

        }

        this.update()

    }

    closeDialogAndParents(dialog:Dialog):void {

        for(;;) {

            this.closeDialog(dialog)

            if(dialog.parent === null)
                break

            dialog = dialog.parent

        }


    }

}
