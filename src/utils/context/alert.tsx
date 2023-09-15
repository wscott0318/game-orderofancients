import { Breakpoint, SxProps } from "@mui/material";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

export type Alert<P, T> = {
    title: string;
    message?: string;
    maxWidth?: Breakpoint;
    styleProps?: {
        dialogTitle?: SxProps;
        dialogContent?: SxProps;
        dialogActions?: SxProps;
        closeButton?: SxProps;
    };
} & (
    | {
          type: "alert";
      }
    | {
          type: "confirm";
          confirm: () => void;
      }
    | {
          type: "custom";
          content: (props: { onSubmit: (value: P) => void } & T) => JSX.Element;
          props?: Omit<T, "onSubmit">;
          result?: (value: P) => void;
      }
);

export type AlertInternal<P, T> = Alert<P, T> & {
    id: number;
    onClose: () => void;
};

type AlertContext = {
    alerts: AlertInternal<any, {}>[];
    pushAlert: <P, T>(alert: Alert<P, T>) => () => void;
};

const AlertContext = createContext<AlertContext | null>(null);

type AlertProviderProps = {
    children: React.ReactNode;
};

export function AlertContextProvider(props: AlertProviderProps) {
    let prevId = useRef(0).current;

    const [alerts, setAlerts] = useState<AlertInternal<any, any>[]>([]);

    const pushAlert = useCallback(
        <P extends any, T extends any>(alert: Alert<P, T>) => {
            const id = ++prevId;

            const onClose = () => {
                setAlerts((alerts) => alerts.filter((e) => e.id !== id));
            };

            setAlerts((alerts) => [...alerts, { id, onClose, ...alert }]);

            return onClose;
        },
        []
    );

    return (
        <AlertContext.Provider value={{ alerts, pushAlert }}>
            {props.children}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);

    const pushError = useCallback(
        (error: unknown) => {
            if (context) {
                context.pushAlert({
                    type: "alert",
                    title: "Error",
                    message:
                        error instanceof Error ? error.message : String(error),
                });
            }
        },
        [context]
    );

    if (!context) {
        throw new Error("Alert parent context not found");
    }

    return { ...context, pushError };
}
