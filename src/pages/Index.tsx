import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const GAMES = {
  slots: [
    { id: 1, title: 'Anubis Wrath', provider: 'PGSOFT', image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop' },
    { id: 2, title: 'Wild Bounty Showdown', provider: 'PGSOFT', image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=300&fit=crop' },
    { id: 3, title: 'Crown Coins', provider: 'ENDORPHINA', image: 'https://images.unsplash.com/photo-1616683693479-c924d0e8e7e9?w=400&h=300&fit=crop' },
    { id: 4, title: 'Mega Fortune', provider: 'NETENT', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop' },
  ],
  fastGames: [
    { id: 5, title: 'Lucky Wheel', provider: 'SPRIBE', image: 'https://images.unsplash.com/photo-1570303363992-bc1a3e0a0fcd?w=400&h=300&fit=crop' },
    { id: 6, title: 'Rocket Blast', provider: 'SPRIBE', image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=300&fit=crop' },
    { id: 7, title: 'Coin Flip', provider: 'SMARTSOFT', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop' },
  ],
};

const PAYMENT_METHODS = [
  { id: 'card', name: 'Банковская карта', icon: 'CreditCard' },
  { id: 'crypto', name: 'Криптовалюта', icon: 'Bitcoin' },
  { id: 'wallet', name: 'Электронный кошелек', icon: 'Wallet' },
  { id: 'mobile', name: 'Мобильный платеж', icon: 'Smartphone' },
];

const BALANCE_API = 'https://functions.poehali.dev/f94f1e9d-6e4d-4cb4-a2b2-2c71098604c4';

const getUserId = () => {
  let userId = localStorage.getItem('lucky_bear_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('lucky_bear_user_id', userId);
  }
  return userId;
};

export default function Index() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState('games');
  const [walletPage, setWalletPage] = useState('deposit');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const userId = getUserId();

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await fetch(BALANCE_API, {
        headers: {
          'X-User-Id': userId
        }
      });
      const data = await response.json();
      setBalance(data.user.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (amount: number, type: string, gameType: string, description: string) => {
    try {
      const response = await fetch(BALANCE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          amount,
          type,
          game_type: gameType,
          description
        })
      });
      const data = await response.json();
      setBalance(data.balance);
      await loadBalance();
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const playGame = async (gameTitle: string, gameType: string) => {
    const betAmount = -100;
    await updateBalance(betAmount, 'bet', gameType, `Ставка в игре ${gameTitle}`);
    
    setTimeout(async () => {
      const isWin = Math.random() > 0.5;
      if (isWin) {
        const winAmount = Math.floor(Math.random() * 300) + 150;
        await updateBalance(winAmount, 'win', gameType, `Выигрыш в игре ${gameTitle}`);
      }
    }, 2000);
  };

  const handleDeposit = async () => {
    if (amount && selectedMethod) {
      await updateBalance(Number(amount), 'deposit', 'payment', `Пополнение через ${selectedMethod}`);
      setShowDepositModal(false);
      setAmount('');
      setSelectedMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {currentPage === 'games' && (
        <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="px-3 py-2.5 flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-primary leading-tight">JUST</h1>
              <h2 className="text-[10px] text-foreground font-semibold leading-tight">GAMES</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-card border-2 border-primary/30 rounded-full px-3 py-1.5">
              <Icon name="Coins" className="text-accent" size={16} />
              <span className="font-semibold text-sm">{balance.toLocaleString()}</span>
            </div>
            <Button 
              onClick={() => setShowDepositModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-1.5 h-auto text-sm"
            >
              <Icon name="Wallet" size={16} className="sm:mr-1.5" />
              <span className="hidden sm:inline">Пополнить</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-3 py-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="ghost" className="rounded-full gap-1.5 bg-primary/10 text-primary whitespace-nowrap px-3 py-1.5 h-auto text-sm">
            <Icon name="Clock" size={16} />
            История
          </Button>
          <Button variant="ghost" className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap px-3 py-1.5 h-auto text-sm">
            <Icon name="Heart" size={16} />
            Важное
          </Button>
          <Button variant="ghost" className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap px-3 py-1.5 h-auto text-sm">
            <Icon name="Gift" size={16} />
            Подарочный
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'default' : 'outline'}
            className={`rounded-full whitespace-nowrap px-4 py-1.5 h-auto text-sm ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Grid3x3" size={16} className="mr-1.5" />
            Все
          </Button>
          <Button
            onClick={() => setActiveTab('slots')}
            variant={activeTab === 'slots' ? 'default' : 'outline'}
            className={`rounded-full whitespace-nowrap px-4 py-1.5 h-auto text-sm ${activeTab === 'slots' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Cherry" size={16} className="mr-1.5" />
            Слоты
          </Button>
          <Button
            onClick={() => setActiveTab('fast')}
            variant={activeTab === 'fast' ? 'default' : 'outline'}
            className={`rounded-full whitespace-nowrap px-4 py-1.5 h-auto text-sm ${activeTab === 'fast' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Zap" size={16} className="mr-1.5" />
            Быстрые игры
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 p-6 text-center">
            <div className="text-5xl mb-3">🎰</div>
            <h3 className="text-xl font-semibold mb-2">Добро пожаловать в Just Games</h3>
            <p className="text-sm text-muted-foreground">Выберите категорию игр в меню выше</p>
          </Card>

          {transactions.length > 0 && (
            <Card className="bg-card border-border p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Icon name="History" size={16} />
                Последние транзакции
              </h4>
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.transaction_type === 'win' ? 'bg-green-500/20' :
                        tx.transaction_type === 'deposit' ? 'bg-primary/20' : 'bg-red-500/20'
                      }`}>
                        <Icon 
                          name={tx.transaction_type === 'win' ? 'TrendingUp' : tx.transaction_type === 'deposit' ? 'Wallet' : 'TrendingDown'} 
                          size={16}
                          className={tx.transaction_type === 'win' ? 'text-green-500' : tx.transaction_type === 'deposit' ? 'text-primary' : 'text-red-500'}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium">{tx.description}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(tx.created_at).toLocaleString('ru-RU')}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}₽
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      </>
      )}

      {currentPage === 'profile' && (
        <div className="px-3 py-6 max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
              <span className="text-2xl">🇷🇺</span>
              <span className="text-sm font-medium">Russia</span>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-blue-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-primary/50">
                <Icon name="Star" size={64} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">Серия-dy</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm">UID:1704028377</span>
              <Icon name="Copy" size={14} />
            </div>
          </div>

          <Card className="bg-card border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Coins" size={20} className="text-white" />
                </div>
                <span className="text-3xl font-bold">{balance}</span>
              </div>
              <button 
                onClick={() => setCurrentPage('bet-history')}
                className="text-primary text-sm hover:underline"
              >
                История ставок
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentPage('withdrawal')}
                className="text-left"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>Доступно для вывода</span>
                  <Icon name="HelpCircle" size={12} />
                </div>
                <div className="text-green-500 font-semibold">{balance}₽ {'>'}</div>
              </button>
              <button
                onClick={() => setCurrentPage('bonus-history')}
                className="text-left"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>Бонусный счёт</span>
                  <Icon name="HelpCircle" size={12} />
                </div>
                <div className="text-primary font-semibold">0₽ {'>'}</div>
              </button>
            </div>
          </Card>

          <div className="flex gap-3 mb-6">
            <Button 
              onClick={() => setShowDepositModal(true)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl text-base font-semibold"
            >
              <Icon name="DollarSign" size={20} className="mr-2" />
              Пополнить
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-base font-semibold">
              <Icon name="ArrowUpRight" size={20} className="mr-2" />
              Вывести
            </Button>
          </div>

          <Card className="bg-card border-border p-5">
            <h3 className="text-xl font-bold mb-4">Акция пополнения</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground mb-2">
                <div>Сумма пополнения</div>
                <div>Процент бонуса</div>
                <div>Бонусная сумма</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center py-3 border-t border-border">
                <div className="font-semibold">300₽</div>
                <div className="font-semibold">120%</div>
                <div className="text-accent font-bold">360₽</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center py-3 border-t border-border">
                <div className="font-semibold">1 000₽</div>
                <div className="font-semibold">180%</div>
                <div className="text-accent font-bold">1 800₽</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {currentPage === 'bet-history' && (
        <div className="px-3 py-6 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setCurrentPage('profile')} className="p-2">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold">История ставок</h1>
          </div>

          <div className="space-y-3">
            {transactions.filter(t => t.transaction_type === 'bet' || t.transaction_type === 'win').map((tx: any) => (
              <Card key={tx.id} className="bg-card border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.transaction_type === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <Icon 
                        name={tx.transaction_type === 'win' ? 'TrendingUp' : 'TrendingDown'} 
                        size={24}
                        className={tx.transaction_type === 'win' ? 'text-green-500' : 'text-red-500'}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.game_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${
                    tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}₽
                  </span>
                </div>
              </Card>
            ))}
            {transactions.filter(t => t.transaction_type === 'bet' || t.transaction_type === 'win').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="History" size={48} className="mx-auto mb-3 opacity-50" />
                <p>История ставок пуста</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'withdrawal' && (
        <div className="px-3 py-6 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setCurrentPage('profile')} className="p-2">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold">Вывод средств</h1>
          </div>

          <Card className="bg-card border-border p-5 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">Доступно для вывода</p>
              <p className="text-4xl font-bold text-green-500">{balance}₽</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Основной счёт</span>
                <span className="font-semibold">{balance}₽</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Заблокировано</span>
                <span className="font-semibold">0₽</span>
              </div>
            </div>
          </Card>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-lg font-semibold mb-4">
            <Icon name="ArrowUpRight" size={24} className="mr-2" />
            Вывести средства
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Минимальная сумма вывода: 100₽
          </p>
        </div>
      )}

      {currentPage === 'bonus-history' && (
        <div className="px-3 py-6 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setCurrentPage('profile')} className="p-2">
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-bold">Бонусный счёт</h1>
          </div>

          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Текущий бонусный баланс</p>
              <p className="text-4xl font-bold text-accent">0₽</p>
              <p className="text-xs text-muted-foreground mt-2">Активируйте бонусы при пополнении</p>
            </div>
          </Card>

          <h3 className="font-semibold mb-3">История бонусов</h3>
          <div className="space-y-3">
            {transactions.filter(t => t.description.includes('бонус') || t.description.includes('Бонус')).map((tx: any) => (
              <Card key={tx.id} className="bg-card border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Icon name="Gift" size={24} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-accent">+{tx.amount}₽</span>
                </div>
              </Card>
            ))}
            {transactions.filter(t => t.description.includes('бонус') || t.description.includes('Бонус')).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Gift" size={48} className="mx-auto mb-3 opacity-50" />
                <p>У вас пока нет бонусов</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'wallet' && (
        <div className="min-h-screen bg-background pb-20">
          <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="px-3 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="Coins" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{balance}</p>
                    <p className="text-xs text-muted-foreground">Основной баланс</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowDepositModal(true)}
                  className="bg-primary hover:bg-primary/90 rounded-full"
                >
                  <Icon name="Wallet" size={18} className="mr-1.5" />
                  Пополнить
                </Button>
              </div>
              <div className="flex gap-2 border-b border-border">
                <button
                  onClick={() => setWalletPage('deposit')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    walletPage === 'deposit' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  Пополнить
                </button>
                <button
                  onClick={() => setWalletPage('withdraw')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    walletPage === 'withdraw' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  Вывести
                </button>
                <button
                  onClick={() => setWalletPage('history')}
                  className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    walletPage === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  История
                  <Icon name="Clock" size={16} className="inline ml-1" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-3 py-4">
            {walletPage === 'deposit' && (
              <div>
                <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🎁</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">🔥Выберите способ пополнения и получите до</p>
                      <p className="text-2xl font-bold">360% +250FS</p>
                    </div>
                    <Icon name="ChevronRight" size={24} className="text-accent" />
                  </div>
                </Card>

                <h3 className="font-semibold mb-3">Выберите способ оплаты</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3 mb-2">
                    <span className="text-sm">🇷🇺 RUB</span>
                    <Icon name="ChevronDown" size={18} />
                  </div>
                </div>

                <div className="bg-card border-l-4 border-primary rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary"></div>
                    Оплатить в рублях
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: '✓', name: 'Перевод со Сбербанка', range: 'От 1 077₽ до 300 000₽', badge: 'HOT' },
                      { icon: '🏦', name: 'Перевод с Т-банка', range: 'От 1 077₽ до 300 000₽' },
                      { icon: '🅰️', name: 'Перевод с Альфа-банка', range: 'От 1 077₽ до 300 000₽' },
                      { icon: '💳', name: 'Перевод через ВТБ', range: 'От 1 077₽ до 300 000₽' },
                      { icon: '📱', name: 'Перевод по номеру', range: 'От 2 077₽ до 300 000₽' },
                      { icon: '💳', name: 'Перевод по номеру карты', range: 'От 3 077₽ до 300 000₽' },
                    ].map((method, idx) => (
                      <button
                        key={idx}
                        onClick={() => setShowDepositModal(true)}
                        className="w-full flex items-center gap-3 bg-secondary/50 hover:bg-secondary rounded-lg p-3 transition-colors relative"
                      >
                        {method.badge && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {method.badge}
                          </span>
                        )}
                        <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center text-2xl">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.range}</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card border-l-4 border-primary rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary"></div>
                    Криптовалютный платеж
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Icon name="ThumbsUp" size={14} />
                    Мгновенное зачисление, без комиссии!
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: '📱', name: '@CryptoBot', range: 'От 20USDT до 2 000USDT' },
                      { icon: '💎', name: 'USDT (TON)', range: 'От 20USDT до 2 000USDT', badge: 'FREE' },
                    ].map((method, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 bg-secondary/50 hover:bg-secondary rounded-lg p-3 transition-colors relative"
                      >
                        {method.badge && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                            {method.badge}
                          </span>
                        )}
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.range}</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {walletPage === 'withdraw' && (
              <div>
                <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">💰</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Специальная акция с реальным призовым фондом:</p>
                      <p className="text-lg font-bold">чем больше баланс, тем выше шанс выигрыша!</p>
                    </div>
                    <Icon name="ChevronRight" size={24} className="text-blue-400" />
                  </div>
                </Card>

                <h3 className="text-lg font-semibold mb-3">Пожалуйста, выберите способ оплаты</h3>
                
                <div className="bg-card border-l-4 border-primary rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3">Оплатить в рублях</h4>
                  <div className="space-y-2">
                    {[
                      { icon: '📱', name: 'Перевод по номеру', range: 'От 2 200₽ до 200 000₽', badge: 'HOT' },
                      { icon: '💳', name: 'Перевод по номеру карты', range: 'От 3 300₽ до 200 000₽' },
                      { icon: '🎨', name: 'piastrix', range: 'От 2 200₽ до 100 000₽' },
                    ].map((method, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 bg-secondary/50 hover:bg-secondary rounded-lg p-3 transition-colors relative"
                      >
                        {method.badge && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {method.badge}
                          </span>
                        )}
                        <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center text-2xl">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.range}</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card border-l-4 border-primary rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Криптовалютный платеж</h4>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Icon name="ThumbsUp" size={14} />
                    Мгновенное зачисление, без комиссии!
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: '📱', name: '@CryptoBot', range: 'От 20USDT до 2 000USDT' },
                      { icon: '💎', name: 'USDT (TON)', range: 'От 20USDT до 2 000USDT' },
                    ].map((method, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 bg-secondary/50 hover:bg-secondary rounded-lg p-3 transition-colors"
                      >
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.range}</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {walletPage === 'history' && (
              <div className="space-y-3">
                {transactions.slice(0, 20).map((tx: any) => (
                  <Card key={tx.id} className="bg-card border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.transaction_type === 'win' ? 'bg-green-500/20' :
                          tx.transaction_type === 'deposit' ? 'bg-primary/20' : 'bg-red-500/20'
                        }`}>
                          <Icon 
                            name={tx.transaction_type === 'win' ? 'TrendingUp' : tx.transaction_type === 'deposit' ? 'Wallet' : 'TrendingDown'} 
                            size={24}
                            className={tx.transaction_type === 'win' ? 'text-green-500' : tx.transaction_type === 'deposit' ? 'text-primary' : 'text-red-500'}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString('ru-RU')}</p>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${
                        tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}₽
                      </span>
                    </div>
                  </Card>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="History" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>История транзакций пуста</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50">
        <div className="flex items-center justify-around py-2 px-2 max-w-screen-xl mx-auto">
          <button 
            onClick={() => setCurrentPage('games')}
            className={`flex flex-col items-center gap-0.5 min-w-0 flex-1 ${currentPage === 'games' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="Gamepad2" size={22} />
            <span className="text-[10px] font-medium">Игры</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground min-w-0 flex-1">
            <Icon name="Star" size={22} />
            <span className="text-[10px]">VIP</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground min-w-0 flex-1">
            <Icon name="Gift" size={22} />
            <span className="text-[10px]">Бонусы</span>
          </button>
          <button 
            onClick={() => setCurrentPage('wallet')}
            className={`flex flex-col items-center gap-0.5 min-w-0 flex-1 ${currentPage === 'wallet' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="Wallet" size={22} />
            <span className="text-[10px]">Пополнить</span>
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center gap-0.5 min-w-0 flex-1 ${currentPage === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="User" size={22} />
            <span className="text-[10px]">Профиль</span>
          </button>
        </div>
      </nav>

      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="bg-card border-border max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Пополнение счета</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs text-muted-foreground mb-2.5 block">Выберите способ оплаты</label>
              <div className="grid grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon name={method.icon as any} size={28} className="mx-auto mb-1.5" />
                    <span className="text-xs font-medium block">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Сумма пополнения</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="w-full px-3 py-2.5 bg-background border-2 border-border rounded-lg focus:border-primary outline-none text-base"
              />
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {[500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(String(preset))}
                    className="py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-medium transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={!selectedMethod || !amount}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base font-semibold rounded-lg disabled:opacity-50"
            >
              Пополнить баланс
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}