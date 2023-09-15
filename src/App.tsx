import { Route, Routes, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import GamePage from "./pages/GamePage";
import { AlertContextProvider } from "./utils/context/alert";
import { ApolloClientProvider } from "./libs/apollo";
import { Alerts } from "./components/common/Alerts";

function App() {
    return (
        <AlertContextProvider>
            <ApolloClientProvider>
                <Alerts />

                <div className="App">
                    <Routes>
                        <Route path="/" element={<GamePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>

                <Analytics />
            </ApolloClientProvider>
        </AlertContextProvider>
    );
}

export default App;
