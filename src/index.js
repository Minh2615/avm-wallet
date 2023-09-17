import './index.scss';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideBar from './components/sidebar';
// wallet
import ListCurrencys from './components/currency';
import DetailCurrency from './components/currency/detail';
import CreateCurrencys from './components/currency/create';
import classnames from 'classnames';

function Index() {
    return (
        <>
            <BrowserRouter
                basename={/^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/
                    .exec(evm_wallet_setting.site_url)[2]
                    .slice(0, -1)}>
                <div className='learnpress-live-setting text-slate-500 antialiased bg-white js-focus-visible font-sans'>
                    <div className='w-full max-w-8xl mx-auto'>
                        <div
                            className={classnames(
                                "hidden lg:block fixed z-50 inset-0 right-auto border-r w-[18.5rem]"
                            )}>
                            <SideBar />
                        </div>

                        <div className='lg:pl-[18.5rem]'>
                            <main className='min-w-0 mx-auto relative'>
                                <Routes>
                                    <Route
                                        path={`/${evm_wallet_setting?.page_slug}/currencys`}
                                        element={<ListCurrencys />}
                                    />
                                    <Route
                                        path={`/${evm_wallet_setting?.page_slug}/currencys/create`}
                                        element={<CreateCurrencys />}
                                    />
                                    <Route
                                        path={`/${evm_wallet_setting?.page_slug}/currencys/edit/:currencyID`}
                                        element={<DetailCurrency />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </>
    );
}

wp.element.render(
    <Index />,
    document.getElementById('evm-wallet-setting-root')
);
