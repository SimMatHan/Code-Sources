import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export class CustomCalendarControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _calendar: Calendar;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;

        this._calendar = new Calendar(this._container, {
            plugins: [dayGridPlugin, interactionPlugin],
            editable: true,
            events: this.fetchEventsFromCRM(context),
            eventDrop: this.onEventDrop.bind(this)
        });

        this._calendar.render();
    }

    private fetchEventsFromCRM(context: ComponentFramework.Context<IInputs>) {
        // Convert the records object to an array
        const recordsArray = Object.keys(context.parameters.dataSet.records).map(key => context.parameters.dataSet.records[key]);
        return recordsArray.map((record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord) => ({
            id: record.getRecordId(),
            title: record.getValue('subject') as string,
            start: record.getValue('scheduledstart') as Date,
            end: record.getValue('scheduledend') as Date,
            color: record.getValue('statuscode') === 'completed' ? 'green' : 'red'
        }));
    }

    private onEventDrop(eventInfo: { event: { id: string; start: Date | null; end: Date | null; } }) {
        const { id, start, end } = eventInfo.event;
        if (start && end) {
            const updatedRecord = {
                id,
                scheduledstart: start,
                scheduledend: end
            };
            this.updateCRMRecord(updatedRecord);
        } else {
            console.error("Event start or end date is null, cannot update record.");
        }
    }

    private updateCRMRecord(record: { id: string; scheduledstart: Date; scheduledend: Date }) {
        const entity = {
            scheduledstart: record.scheduledstart,
            scheduledend: record.scheduledend
        };
        Xrm.WebApi.updateRecord("appointment", record.id, entity).then(
            () => { console.log("Record updated successfully."); },
            (error) => { console.error("Error updating record:", error); }
        );
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._calendar.refetchEvents();
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this._calendar.destroy();
    }
}
