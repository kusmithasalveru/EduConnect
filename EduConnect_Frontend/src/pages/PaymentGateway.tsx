import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Landmark, QrCode } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { PaymentMethod } from '../state/types'

export default function PaymentGateway() {
    const { state, actions } = useApp()
    const navigate = useNavigate()

    const [method, setMethod] = useState<PaymentMethod>('UPI')
    const [upiId, setUpiId] = useState('')
    const [bank, setBank] = useState('HDFC Bank')
    const [otherRef, setOtherRef] = useState('')
    const [isPaying, setIsPaying] = useState(false)

    const title = useMemo(() => {
        const p = state.pendingPayment
        if (!p) return 'Payment'
        if (p.kind === 'tutor_session') return `Payment • Tutor Session with ${p.tutorName}`
        return `Payment • Course Enrollment`
    }, [state.pendingPayment])

    if (!state.pendingPayment) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Gateway</h1>
                    <p className="text-gray-600 dark:text-gray-400">No pending payment found.</p>
                    <button
                        onClick={() => navigate('/tutors')}
                        className="mt-6 px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Go to Find Tutors
                    </button>
                </div>
            </div>
        )
    }

    const canPay =
        method === 'UPI' ? upiId.trim().length > 3 : method === 'NetBanking' ? bank.trim().length > 1 : otherRef.trim().length > 1

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Choose a method and complete your payment.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Methods</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => setMethod('UPI')}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${method === 'UPI'
                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <QrCode size={16} />
                                UPI
                            </button>
                            <button
                                onClick={() => setMethod('NetBanking')}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${method === 'NetBanking'
                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <Landmark size={16} />
                                Net Banking
                            </button>
                            <button
                                onClick={() => setMethod('Other')}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${method === 'Other'
                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <CreditCard size={16} />
                                Other
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
                        {method === 'UPI' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pay with UPI</h2>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UPI ID</label>
                                <input
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="name@bank"
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        )}

                        {method === 'NetBanking' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pay with Net Banking</h2>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Bank</label>
                                <select
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                >
                                    <option>HDFC Bank</option>
                                    <option>ICICI Bank</option>
                                    <option>SBI</option>
                                    <option>Axis Bank</option>
                                </select>
                            </div>
                        )}

                        {method === 'Other' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Other Methods</h2>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reference</label>
                                <input
                                    value={otherRef}
                                    onChange={(e) => setOtherRef(e.target.value)}
                                    placeholder="Card / Wallet / Reference"
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!canPay || isPaying}
                                onClick={async () => {
                                    if (!canPay || isPaying) return
                                    setIsPaying(true)
                                    try {
                                        await actions.completePendingPayment(method)
                                        navigate('/', { replace: true })
                                    } finally {
                                        setIsPaying(false)
                                    }
                                }}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${!canPay || isPaying
                                        ? 'bg-gray-200 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                                    }`}
                            >
                                {isPaying ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

