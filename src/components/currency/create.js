import { __ } from '../i18n';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

import MenuItem from '@mui/material/MenuItem';
import Select from "@mui/material/Select";
import { useParams } from "react-router";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';



export default function CreateCurrencys() {

    const [loadingSave, setLoadingSave] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("success");

    const [title, setTitle] = useState("");
    const [minCrawl, setMinCrawl] = useState(0);
    const [minSwap, setMinSwap] = useState(0);
    const [usdRate, setUsdRate] = useState(0);
    const [image, setImage] = useState("");
    const [imageUpload, setImageUpload] = useState("");
    const [statusCurrency, setStatusCurrency] = useState(false);
    const [code, setCode] = useState("");
    const [transferFee, setTransferFee] = useState(0);
    const [swapFee, setSwapFee] = useState(0);
    const [maxSwap, setMaxSwap] = useState(0);
    const [type, setType] = useState("");
    const [transferFeeType, setTransferFeeType] = useState(0);
    const [swapFeeType, setSwapFeeType] = useState(0);

    //upload image
    function handleChangeImage(e) {
        console.log(e.value);
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const handleCreateCurrency = async () => {
        try {
            setLoadingSave(true);
            const response = await apiFetch({
                path: "/evm-wallet/v1/currencys/create/",
                method: "POST",
                data: {
                    title: title,
                    min_crawl: minCrawl,
                    min_swap: minSwap,
                    usd_rate: usdRate,
                    image: imageUpload,
                    code: code,
                    transfer_fee: transferFee,
                    swap_fee: swapFee,
                    max_swap: maxSwap,
                    type: type,
                    transfer_fee_type: transferFeeType,
                    swap_fee_type: swapFeeType,
                },
            });
            if (response.data) {
                setMessage(response.message);
                setStatus(response?.status);
            } else {
                setMessage(response.message);
                setStatus(response?.status);
            }
            setLoadingSave(false);
            if ( response.status == 'success' ) {
				setTimeout( () => {
					window.location.href =
                    evm_wallet_setting?.page_settings + 'currencys/';
				}, 1000 );
			}
        } catch (e) {
            setMessage(e.message);
        }
    };

    return (
        <>
            <div className='sticky top-0 z-50 bg-white flex items-center justify-between px-8 py-5 border-b'>
                <div className='flex items-center text-xl font-bold text-gray-900'>
                    {__("Create Currency",)}
                </div>
            </div>
            <div class='px-8 py-5'>
                <div className='bg-white rounded-lg flex justify-between'>
                    <div className='flex flex-col w-1/3	px-4'>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='title'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Title",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    label='Title'
                                    value={title}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='minCrawl'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Min Crawl",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='Min Crawl'
                                    value={minCrawl}
                                    InputProps={{
                                        inputProps: { 
                                            max: 10, min: 0.1, step: 0.1
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setMinCrawl(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='minSwap'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Min Swap",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='Min Swap'
                                    value={minSwap}
                                    InputProps={{
                                        inputProps: { 
                                            max: 100, min: 1, step: 1
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setMinSwap(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='usdrate'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("USD Rate",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='USD Rate'
                                    value={usdRate}
                                    InputProps={{
                                        inputProps: { 
                                            max: 1000, min: 1, step: 1
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setUsdRate(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='image'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Currency Icon",)}
                            </label>
                            <div className='basis-4/6'>
                                { ! image && <input type="file" onChange={(e)=>{
                                    // setImageUpload(e.target.value);
                                    setImageUpload(URL.createObjectURL(e.target.files[0]));
                                }} />}
                                <img className={image && 'w-16 h-16'} src={image} />
                                {image ?
                                    <button className="text-sm px-4 py-2 flex items-center rounded-md font-semibold border-solid border mt-3" 
                                        onClick={() => {
                                            setImage("");
                                        }}>Remove Icon</button> : ""}
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='status'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Status",)}
                            </label>
                            <div className='basis-4/6'>
                                <Switch
                                    checked={statusCurrency}
                                    onChange={() => {
                                        setStatusCurrency(!statusCurrency);
                                    }}
                                    inputProps={{ 'aria-label': 'status' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-1/3	px-4'>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='code'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Code",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    label='Code'
                                    value={code}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='transferfee'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Transfer Fee",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='Transfer Fee'
                                    value={transferFee}
                                    InputProps={{
                                        inputProps: { 
                                            max: 1000, min: 1, step: 1
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setTransferFee(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='swapfee'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Swap Fee",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='Swap Fee'
                                    value={swapFee}
                                    InputProps={{
                                        inputProps: { 
                                            max: 10, min: 1, step: 0.0001
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setSwapFee(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='maxswap'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Max Swap",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    type="number"
                                    label='Max Swap'
                                    value={maxSwap}
                                    InputProps={{
                                        inputProps: { 
                                            max: 100, min: 1, step: 1
                                        }
                                    }}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setMaxSwap(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-1/3	px-4'>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='type'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Type",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    label='Type'
                                    value={type}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setType(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='transferfeetype'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Transfer Fee Type",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    label='Transfer Fee Typ'
                                    value={transferFeeType}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setTransferFeeType(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center pb-5 mb-6'>
                            <label
                                htmlFor='swapfeetype'
                                className='block text-sm font-medium text-gray-700 basis-2/6'>
                                {__("Swap Fee Type",)}
                            </label>
                            <div className='basis-4/6'>
                                <TextField
                                    id='outlined-name'
                                    label='Swap Fee Type'
                                    value={swapFeeType}
                                    className='hide-focus-input w-full'
                                    onChange={(e) =>
                                        setSwapFeeType(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-3 flex items-center gap-x-2'>
                    <button
                        onClick={() =>
                            handleCreateCurrency()
                        }
                        className='text-[12px] uppercase text-white bg-indigo-600 rounded shadow-sm px-3 py-2 font-medium flex items-center gap-1 focus:outline-none'>
                        {loadingSave && (
                            <svg
                                className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'>
                                <circle
                                    className='opacity-25'
                                    cx='12'
                                    cy='12'
                                    r='10'
                                    stroke='currentColor'
                                    strokeWidth='4'></circle>
                                <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                        )}
                        {__("Create",)}
                    </button>
                </div>
            </div>
        </>
    )
}