export interface IActionWithPayload {
    type: string;
    payload: {
        value: any;
    };
}

/**
 * Instead of creating boilerplate code for simple insert/update/delete state values,
 * use setKeyValue along with the KeyValueReducerGenerator.
 * As a starting example, look at searchAPIEndpoint in Reducers.ts in the jsadmin-machine-learning project.
 */
export const setValue = (type: string, value: any): IActionWithPayload => ({
    payload: { value },
    type
});

export const ReducerGenerator = (actionType: string, defaultState: any) => (
    state = defaultState,
    action: IActionWithPayload
) => (actionType === action.type && !!action.payload && action.payload.value) || state;
