import Head from 'next/head';
import { store } from '../src/storage/store';
import { Provider } from 'react-redux';
import Notifications from '../src/components/Notifications/Notifications';
import Spinner from '../src/components/Spinner/Spinner';
import '../styles/globals.scss';
import '../styles/fonts.scss';
import '../src/components/Tab/Tab.scss';
import '../src/components/Search/Search.scss';
import '../src/components/Modal/Modal.scss';
import '../src/components/Stores/Stores.scss';
import '../src/components/Products/Products.scss';
import '../src/components/Sales/Sales.scss';
import '../src/components/Users/Users.scss';
import '../src/components/Fixes/Fixes.scss';
import '../src/components/Tools/Tools.scss';
import '../src/components/Footer/Footer.scss';
import '../src/components/Spinner/Spinner.scss';

function MyApp({ Component, pageProps }) {
    return (<>
        <Provider store={store}>
            <Head>
                <title>HA Fix Cell</title>
                <meta name="description" content="Punto de venta HA Fix Cell" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Notifications />
            <Spinner />
            <main>
                <Component {...pageProps} />
            </main>
        </Provider>
    </>);
}

export default MyApp;
