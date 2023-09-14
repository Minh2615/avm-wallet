import { __ } from '../i18n';
import { NavLink } from 'react-router-dom';
import { useRef, useState } from '@wordpress/element';
import Logo from '/publish/logo.png';
import classnames from 'classnames';
import { Dialog, Transition } from '@headlessui/react';

const NAV_LINKS = [
	{
		title: __( 'Currencys' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={ 1.5 }
				stroke="currentColor"
				className="w-6 h-6">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
				/>
			</svg>
		),
		to: '/currencys/',
	},
	{
		title: __( 'Settings' ),
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={ 1.5 }
				stroke="currentColor"
				className="w-6 h-6">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
				/>
			</svg>
		),
		to: '/settings/',
	},
];

export default function SideBar() {
	const [ isOpenModalLeave, setIsOpenModalLeave ] = useState( false );
	const [ isOpenModalBack, setIsOpenModalBack ] = useState( false );

	const backButtonRef = useRef( null );
	const logOutButtonRef = useRef( null );

	return (
		<nav className="lg:text-sm lg:leading-6 relative flex flex-col h-full">
			<div className="min-h-[80px] w-full relative mb-4">
				<div className="flex items-center inset-y-0 h-full inset-x-5 mt-3">
					<img
						className="learnpress-live-course__logo w-full"
						src={ evm_wallet_setting?.logo_url || Logo }
						alt=""
					/>
				</div>
			</div>
			<ul className="mt-5 overflow-y-auto flex-1">
				{ NAV_LINKS.map( ( link, linkIndex ) => (
					<li key={ linkIndex }>
						<NavLink
							to={ `/${ evm_wallet_setting?.page_slug }${ link.to }` }
							className={ ( { isActive } ) =>
								classnames(
									'flex items-center p-2.5 mb-1 px-4 border-l-4 font-medium transition-colors duration-200 gap-x-3 focus:outline-none',
									{
										'border-indigo-600 bg-indigo-100/60 text-indigo-600 [&>*:first-child]:text-indigo-600':
                                            isActive,
										'border-gray-100 text-gray-700 hover:text-gray-800':
                                            ! isActive,
									}
								)
							}
							end={ link.to === '/' ? true : false }>
							<div className="text-gray-400">{ link.icon }</div>
							<span className="">{ link.title }</span>
						</NavLink>
					</li>
				) ) }

				<li>
					<button
						onClick={ () => setIsOpenModalBack( ! isOpenModalBack ) }
						ref={ backButtonRef }
						className={ classnames(
							'flex items-center p-2.5 mb-1 px-4 border-l-4 font-medium transition-colors duration-200 gap-x-3 focus:outline-none border-gray-100 text-gray-700 hover:text-gray-800'
						) }>
						<div className="text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={ 1.5 }
								stroke="currentColor"
								className="w-6 h-6">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
						</div>
						<span className="">{ __( 'Back to Site' ) }</span>
					</button>
				</li>
			</ul>
			<div>
				<div className="text-sm">
					<a href="https://thimpress.com/product/live-course-add-on-for-learnpress/" target="_blank" rel="noopener noreferrer" className={ classnames( 'w-full flex items-center p-2.5 mb-1 px-4 border-l-4 font-medium transition-colors duration-200 gap-x-3 focus:outline-none border-gray-100 text-gray-700 hover:text-gray-800' ) }>
						<div className="text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
							</svg>
						</div>
						<span>{ __( 'More Information' ) }</span>
					</a>
					<a href="https://docspress.thimpress.com/learnpress-live-course-add-on/" target="_blank" rel="noopener noreferrer" className={ classnames( 'w-full flex items-center p-2.5 mb-1 px-4 border-l-4 font-medium transition-colors duration-200 gap-x-3 focus:outline-none border-gray-100 text-gray-700 hover:text-gray-800' ) }>
						<div className="text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
						</div>
						<span>{ __( 'Document' ) }</span>
					</a>
					<button onClick={ () => setIsOpenModalLeave( ! isOpenModalLeave ) } ref={ logOutButtonRef } className={ classnames( 'w-full flex items-center p-2.5 mb-4 px-4 border-l-4 font-medium transition-colors duration-200 gap-x-3 focus:outline-none border-gray-100 text-gray-700 hover:text-gray-800' ) }>
						<div className="text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
							</svg>
						</div>
						<span>{ __( 'Logout' ) }</span>
					</button>
				</div>
			</div>
			<Transition appear show={ isOpenModalLeave }>
				<Dialog
					initialFocus={ logOutButtonRef }
					open={ true }
					as="div"
					className="fixed inset-0 z-50 overflow-y-auto"
					onClose={ () => setIsOpenModalLeave( false ) }
				>
					<div className="min-h-screen flex items-center justify-center px-4 text-center">
						<Transition.Child
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-gray-400/50" />
						</Transition.Child>

						<Transition.Child
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all opacity-100 scale-100">
								<h3 className="text-base font-medium leading-6 text-gray-900">{ __( 'Are you sure you want to log out?' ) }</h3>
								<div className="mt-6 flex justify-center">
									<button onClick={ () => setIsOpenModalLeave( false ) } className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium py-2 px-4 rounded">
										{ __( 'Cancel' ) }
									</button>
									<a href={ evm_wallet_setting?.logout_url } className="bg-indigo-500 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-4 rounded ml-4">
										{ __( 'Logout' ) }
									</a>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
			<Transition appear show={ isOpenModalBack }>
				<Dialog
					initialFocus={ backButtonRef }
					open={ true }
					as="div"
					className="fixed inset-0 z-50 overflow-y-auto"
					onClose={ () => setIsOpenModalBack( false ) }>
					<div className="min-h-screen flex items-center justify-center px-4 text-center">
						<Transition.Child
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-gray-400/50" />
						</Transition.Child>

						<Transition.Child
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<div className="w-full min-w-[300px] max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-center align-middle shadow-xl transition-all opacity-100 scale-100">
								<h3 className="text-base font-medium leading-6 text-gray-900">
									{ __(
										'Are you sure you want to leave this page?'
									) }
								</h3>
								<div className="mt-6 flex justify-center">
									<button
										onClick={ () =>
											setIsOpenModalBack( false )
										}
										className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium py-2 px-4 rounded">
										{ __( 'Cancel' ) }
									</button>
									<a
										href={ evm_wallet_setting?.site_url }
										className="bg-indigo-500 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-4 rounded ml-4">
										{ __( 'Continue' ) }
									</a>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</nav>
	);
}
