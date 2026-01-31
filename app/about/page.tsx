import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    FileText,
    Users,
    TrendingUp,
    Shield,
    Clock,
    CheckCircle2,
    ArrowRight,
    Building2,
    Send
} from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/about" className="flex items-center">
                            <Image
                                src="/logo_with_text.png"
                                alt="Закупка"
                                width={190}
                                height={48}
                            />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Войти</Link>
                            </Button>
                            <Button asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                                <Link href="/register">Регистрация</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/40 to-violet-200/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            B2B платформа нового поколения
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                            Эффективные закупки для{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                вашего бизнеса
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Связываем покупателей и поставщиков через удобную систему запросов коммерческих предложений.
                            Оптимизируйте процесс закупок и находите лучших партнёров.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 h-12 px-8 text-base">
                                <Link href="/register">
                                    Начать работу
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                                <Link href="/login">
                                    Уже есть аккаунт?
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Как это работает
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Простой и прозрачный процесс закупок в три шага
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                            <div className="relative h-full bg-white rounded-xl shadow-lg p-8">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-6">
                                    <FileText className="h-7 w-7 text-white" />
                                </div>
                                <div className="text-sm font-semibold text-indigo-600 mb-2">Шаг 1</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Создайте запрос</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Опишите, что вам нужно закупить: товары, услуги или работы. Укажите требования и сроки поставки.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                            <div className="relative h-full bg-white rounded-xl shadow-lg p-8">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6">
                                    <Send className="h-7 w-7 text-white" />
                                </div>
                                <div className="text-sm font-semibold text-cyan-600 mb-2">Шаг 2</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Получите предложения</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Поставщики видят ваш запрос и отправляют свои коммерческие предложения с ценами и условиями.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                            <div className="relative h-full bg-white rounded-xl shadow-lg p-8">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-7 w-7 text-white" />
                                </div>
                                <div className="text-sm font-semibold text-emerald-600 mb-2">Шаг 3</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Выберите победителя</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Сравните предложения и выберите лучшего поставщика. Начните сотрудничество напрямую.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Преимущества платформы
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Всё необходимое для эффективных B2B закупок
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<TrendingUp className="h-6 w-6" />}
                            title="Экономия времени"
                            description="Автоматизируйте рутинные процессы закупок и сфокусируйтесь на важном"
                            color="orange"
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6" />}
                            title="Широкая база поставщиков"
                            description="Находите новых надёжных поставщиков для вашего бизнеса"
                            color="pink"
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Безопасность данных"
                            description="Ваши данные надёжно защищены современными методами шифрования"
                            color="green"
                        />
                        <FeatureCard
                            icon={<Clock className="h-6 w-6" />}
                            title="Быстрые ответы"
                            description="Получайте предложения от поставщиков в кратчайшие сроки"
                            color="blue"
                        />
                        <FeatureCard
                            icon={<Building2 className="h-6 w-6" />}
                            title="Для любого бизнеса"
                            description="Подходит как для малого бизнеса, так и для крупных компаний"
                            color="violet"
                        />
                        <FeatureCard
                            icon={<FileText className="h-6 w-6" />}
                            title="Прозрачность"
                            description="Полная история запросов и предложений всегда под рукой"
                            color="indigo"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Готовы оптимизировать закупки?
                    </h2>
                    <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Присоединяйтесь к платформе уже сегодня и начните получать выгодные предложения от проверенных поставщиков.
                    </p>
                    <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-indigo-50 h-12 px-8 text-base font-semibold">
                        <Link href="/register">
                            Зарегистрироваться бесплатно
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Image
                            src="/logo_with_text.png"
                            alt="Закупка"
                            width={190}
                            height={48}
                            className=" brightness-0 invert opacity-80"
                        />
                        <p className="text-sm">
                            © {new Date().getFullYear()} Закупка. Все права защищены.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const colorMap = {
    orange: 'from-orange-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    violet: 'from-violet-500 to-purple-500',
    indigo: 'from-indigo-500 to-blue-500',
}

function FeatureCard({
    icon,
    title,
    description,
    color
}: {
    icon: React.ReactNode
    title: string
    description: string
    color: keyof typeof colorMap
}) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white mb-4`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
    )
}

