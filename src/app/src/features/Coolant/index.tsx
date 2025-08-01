import { connect } from 'react-redux';
import get from 'lodash/get';
import { FaShower } from 'react-icons/fa6';
import { FaWater } from 'react-icons/fa';
import { FaBan } from 'react-icons/fa6';

import {
    startMist,
    startFlood,
    stopCoolant,
} from 'app/features/Coolant/utils/actions';
import {
    COOLANT_CATEGORY,
    GRBL,
    GRBL_ACTIVE_STATE_IDLE,
    GRBLHAL,
    WORKFLOW_STATE_RUNNING,
} from 'app/constants';
import useKeybinding from 'app/lib/useKeybinding';
import useShuttleEvents from 'app/hooks/useShuttleEvents';
import { ActiveStateButton } from 'app/components/ActiveStateButton';
import ensureArray from 'ensure-array';
import includes from 'lodash/includes';
import { useCallback } from 'react';
import { useTypedSelector } from 'app/hooks/useTypedSelector';

export interface CoolantProps {
    mistActive: boolean;
    floodActive: boolean;
}

export function Coolant({ mistActive, floodActive }: CoolantProps) {
    const { workflow, isConnected, controllerState, controllerType } =
        useTypedSelector((state) => ({
            workflow: state.controller.workflow,
            isConnected: state.connection.isConnected ?? false,
            controllerState: state.controller.state ?? {},
            controllerType: state.controller.type ?? 'grbl',
        }));

    const shuttleControlEvents = {
        MIST_COOLANT: {
            title: 'Mist Coolant',
            keys: '',
            cmd: 'MIST_COOLANT',
            preventDefault: false,
            isActive: true,
            category: COOLANT_CATEGORY,
            callback: () => startMist(),
        },
        FLOOD_COOLANT: {
            title: 'Flood Coolant',
            keys: '',
            cmd: 'FLOOD_COOLANT',
            preventDefault: false,
            isActive: true,
            category: COOLANT_CATEGORY,
            callback: () => startFlood(),
        },
        STOP_COOLANT: {
            title: 'Stop Coolant',
            keys: '',
            cmd: 'STOP_COOLANT',
            preventDefault: false,
            isActive: true,
            category: COOLANT_CATEGORY,
            callback: () => stopCoolant(),
        },
    };

    useShuttleEvents(shuttleControlEvents);
    useKeybinding(shuttleControlEvents);

    const canClick = useCallback((): boolean => {
        if (!isConnected) return false;
        if (workflow.state === WORKFLOW_STATE_RUNNING) return false;
        if (![GRBL, GRBLHAL].includes(controllerType)) return false;

        const activeState = controllerState?.status?.activeState;
        return activeState === GRBL_ACTIVE_STATE_IDLE;
    }, [
        isConnected,
        workflow.state,
        controllerType,
        controllerState?.status?.activeState,
    ]);

    return (
        <div className="flex flex-col justify-around items-center h-full">
            <div className="flex flex-row justify-around w-full gap-4">
                <ActiveStateButton
                    text="Mist"
                    icon={<FaShower />}
                    onClick={startMist}
                    size="lg"
                    className="w-full h-16"
                    active={mistActive}
                    disabled={!canClick()}
                />
                <ActiveStateButton
                    text="Flood"
                    icon={<FaWater />}
                    onClick={startFlood}
                    size="lg"
                    className="w-full h-16"
                    active={floodActive}
                    disabled={!canClick()}
                />
                <ActiveStateButton
                    text="Off"
                    icon={<FaBan />}
                    onClick={stopCoolant}
                    size="lg"
                    className="w-full h-16"
                    disabled={!canClick()}
                />
            </div>
        </div>
    );
}

export default connect((state) => {
    const coolantModal: string = get(state, 'controller.modal.coolant', 'M9');
    const coolantArray = ensureArray(coolantModal);

    const mistActive = includes(coolantArray, 'M7');
    const floodActive = includes(coolantArray, 'M8');
    return {
        mistActive,
        floodActive,
    };
})(Coolant);
