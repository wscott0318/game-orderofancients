import CloseIcon from "@mui/icons-material/CloseOutlined";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { useCallback, useState } from "react";
import { AlertInternal, useAlert } from "../../utils/context/alert";

type SimpleAlertProps = {
    alert: AlertInternal<any, {}>;
};

function SimpleAlert({ alert }: SimpleAlertProps) {
    const [open, setOpen] = useState(true);

    const onClose = useCallback(() => {
        setOpen(false);
    }, []);

    const onRemove = useCallback(() => {
        alert.onClose();
    }, [alert]);

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            maxWidth={alert.maxWidth ?? "xs"}
            TransitionProps={{
                onExited: onRemove,
            }}
            PaperProps={{
                sx: {
                    border: "none",
                    position: "relative",
                },
            }}
        >
            <IconButton
                size="small"
                onClick={onClose}
                sx={(theme) =>
                    ({
                        position: "absolute",
                        top: theme.spacing(1),
                        right: theme.spacing(1),
                        ...(alert?.styleProps?.closeButton || {}),
                    } as any)
                }
            >
                <CloseIcon fontSize="small" />
            </IconButton>
            <DialogTitle sx={alert?.styleProps?.dialogTitle}>
                {alert.title}
            </DialogTitle>
            <DialogContent sx={alert?.styleProps?.dialogContent}>
                {!!alert.message && (
                    <DialogContentText>{alert.message}</DialogContentText>
                )}
                {alert.type === "custom" && (
                    <alert.content
                        {...alert.props}
                        onSubmit={(value) => {
                            alert.result?.(value);
                            onClose();
                        }}
                    />
                )}
            </DialogContent>
            <DialogActions sx={alert?.styleProps?.dialogActions}>
                {alert.type === "alert" && (
                    <Button autoFocus variant="text" onClick={onClose}>
                        OK
                    </Button>
                )}
                {alert.type === "confirm" && (
                    <>
                        <Button variant="text" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="text"
                            onClick={() => {
                                onClose();
                                alert.confirm!();
                            }}
                        >
                            OK
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export function Alerts() {
    const { alerts } = useAlert();

    return (
        <>
            {alerts.map((alert, index) => (
                <SimpleAlert key={String(index)} alert={alert} />
            ))}
        </>
    );
}
