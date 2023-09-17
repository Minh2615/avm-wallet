import { __ } from '../i18n';
import { NavLink } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import apiFetch from '@wordpress/api-fetch';
import Skeleton from '../skeleton';
import { useEffect, useState } from '@wordpress/element';
import ReactPaginate from 'react-paginate';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

//dialog
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


export default function ListCurrencys() {

    const limit = 10;
	const [ dataCurrency, setDataCurrency ] = useState( [] );
    const [ pagination, setPagination ] = useState( 1 );
	const [ messageNoData, setMessageNoData ] = useState( '' );

    //render new data when search is complete
	const [ dataOld, setDataOld ] = useState( [] );
	const [ textSearch, setTextSearch ] = useState( '' );
	const [ dataInit, setDataInit ] = useState( [] );

    //show noitice when handle action
	const [ isCompleteAction, setIsCompleteAction ] = useState( false );
	const [ message, setMessage ] = useState( '' );
	const [ status, setStatus ] = useState( 'success' );

    //opne modal delete
	const [ openDelete, setOpenDelete ] = useState( false );
	const [ openCreateOrEdit, setOpenCreateOrEdit ] = useState( false );
	const [ idDelete, setIdDelete ] = useState( '' );
	const [ idEdit, setIdEdit ] = useState( '' );
    

    const { mutate } = useSWRConfig();
    //fetch data
	const { data } = useSWR( '/evm-wallet/v1/currencys/get', ( url ) =>
        apiFetch( { path: url } )
    );

    const isLoading = ! data;

    useEffect( () => {
		try {
			if ( data?.data?.length > 0 ) {
				setDataCurrency( data.data );
				//use data initital for search and pagination
				setDataOld( data.data );
				setDataInit( data.data );
				setPagination( Math.ceil( data.data.length / limit ) );
			} else {
				setDataCurrency( [] );
				setMessageNoData( data?.message );
			}
		} catch ( e ) {
			setMessageNoData( e.message );
		}
	}, [ data ] );

    const renderNewData = ( data, paged, text = '' ) => {
		if ( text !== '' ) {
			const newData = dataOld.filter( ( user ) => {
				return user.name
					.toLowerCase()
					.includes( text.toLowerCase() );
			} );

			if ( newData.length > 0 ) {
				let newDataFilter = [];
				const start = paged * limit;
				const end = start + limit;
				newDataFilter = newData.slice( start, end );
				setDataCurrency( newDataFilter );
				setPagination( Math.ceil( newData.length / limit ) );
			} else {
                setDataCurrency( [] );
                setMessageNoData( __( 'No data found' ) );
            }
		} else {
			let newData = [];
			const start = paged * limit;
			const end = start + limit;
			newData = data.slice( start, end );
			setDataCurrency( newData );
			setPagination( Math.ceil( dataInit.length / limit ) );
		}
	};

	return (
		<>
            <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-10 py-8 border-b">
				<div className="flex items-center text-xl font-bold text-gray-900">
					{ __( 'Manage Currency' ) }
				</div>
				<div className="flex items-csenter gap-x-3">
                    <NavLink
						to={ `/${
							evm_wallet_setting?.page_slug
						}/currencys/create/` }>
                        <button
    						className="ring-1 ring-black ring-opacity-5 bg-indigo-600 text-white text-sm px-4 py-2 flex items-center rounded-md font-semibold"
    						onClick={ () => {
    							setIdEdit( '' );
    							setOpenCreateOrEdit( true );
    						} }>
    						{ __( 'Add new' ) }
    					</button>
                    </NavLink>
				</div>
			</div>
            <div className="px-8 py-4 pb-8">
                <div>
					{ isCompleteAction && message ? (
						<Stack sx={ { width: '100%' } } spacing={ 2 }>
							<Alert severity={ status }>{ message }</Alert>
						</Stack>
					) : (
						''
					) }
				</div>
                <div className="mt-3 py-2">
                    { isLoading ? (
						<Skeleton />
					) : (
                        <>
                            <div className="flex justify-end mb-4">
								<div className="w-1/4">
									<div className="relative">
										<input
											type="text"
											className="border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md"
											placeholder={ __( 'Search by currency name' ) }
											value={ textSearch }
											onChange={ ( e ) => {
												setTextSearch(
													e.target.value
												);
												renderNewData(
													dataOld,
													0,
													e.target.value
												);
											} }
										/>
									</div>
								</div>
							</div>
                            { dataCurrency.length > 0 ? (
                                <>
                                    <table className="min-w-full border-solid border border-gray-200 rounded">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    { __( 'Currency' ) }
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    { __( '	Amount' ) }
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    { __( 'Actions' ) }
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                           { dataCurrency.map( ( currency ) => (
                                                <tr key={ currency.id }>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                <div className="flex-shrink-0 flex">
                                                                    <img src={ currency.image } className="w-14 h-14 rounded-full" />
                                                                    <div className="ml-2 flex-shrink-0 flex flex-col justify-center">
                                                                        <span className="px-2 inline-flex text-base leading-5 font-semibold">
                                                                            { currency.title }
                                                                        </span>
                                                                        <span className="px-2 inline-flex text-xs font-normal text-gray-600 mt-2">
                                                                            { currency.sub_title }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                { currency.amount }
                                                            </div>
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    $ { currency.price_amount }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="flex px-6 py-4 whitespace-nowrap text-right text-sm font-medium items-center mt-2">
                                                        <NavLink
															to={ `/${
																evm_wallet_setting?.page_slug
															}/users/edit/${
																currency.id
															}` }
															state={ {
																currencyID:currency.id,
															} }>
															<button className="flex items-center gap-x-1 text-sm text-indigo-500 font-medium mr-2">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-5 w-5"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	strokeWidth={
																		2
																	}>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
																	/>
																</svg>
															</button>
														</NavLink>
														<button
															className="flex items-center gap-x-1 text-sm text-red-500 font-medium outline-none"
															onClick={ () => {
																setOpenDelete(
																	true
																);
																setIdDelete(
																	user.id
																);
															} }>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-5 w-5"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth={
																	2
																}>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																/>
															</svg>
														</button>
													</td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
                                    { openDelete && (
    									<Dialog
    										open={ openDelete }
    										onClose={ () =>
    											setOpenDelete( false )
    										}>
    										<DialogTitle id="alert-dialog-title">
    											{ __( 'Delete User' ) }
    										</DialogTitle>
    										<DialogContent>
    											{ __( 'Do you want to delete this users?.' ) }
    										</DialogContent>
    										<DialogActions>
    											<Button
    												onClick={ () =>
    													setOpenDelete(
    														false
    													)
    												}>
    												{ __( 'Disagree' ) }
    											</Button>
    											<Button
    												onClick={ () =>
    													deleteMeeting(
    														idDelete
    													)
    												}
    												autoFocus>
    												{ __( 'Agree' ) }
    											</Button>
    										</DialogActions>
    									</Dialog>
    								) }
                                    { dataOld.length > 10 && (
										<div className="my-9">
											<ReactPaginate
												breakLabel="..."
												nextLabel={ __( 'Next' ) }
												initialPage={ page }
												pageRangeDisplayed={ 2 }
												marginPagesDisplayed={ 2 }
												pageCount={ pagination }
												onPageChange={ ( e ) => {
													setPage( e.selected );
													renderNewData(
														textSearch
															? dataOld
															: dataInit,
														e.selected,
														textSearch
													);
												} }
												previousLabel={ __(
													'Prev'
												) }
												activeLinkClassName="bg-gray-200"
												containerClassName="flex items-center gap-x-3"
												pageLinkClassName="text-[13px] font-medium flex items-center justify-center h-[35px] w-[42px] text-slate-600 border border-gray-300 shadow-sm rounded"
												previousLinkClassName="text-[13px] font-medium flex items-center justify-center h-[35px] text-slate-600 px-4 border border-gray-300 shadow-sm rounded"
												nextLinkClassName="text-[13px] font-medium flex items-center justify-center h-[35px] text-slate-600 px-4 border border-gray-300 shadow-sm rounded"
												disabledLinkClassName="border-gray-200 bg-gray-200 cursor-not-allowed"
											/>
										</div>
									) }
                                </>
                                ) : (
									<>
										{ messageNoData && (
											<Stack
												sx={ { width: '100%' } }
												spacing={ 2 }>
												<Alert severity="error">
													{ messageNoData }
												</Alert>
											</Stack>
										) }
									</>
								) 
                            }
                        </>
                    ) }
                </div>
            </div>
		</>
	);
}
