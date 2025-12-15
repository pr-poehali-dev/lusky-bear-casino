import { useState } from 'react';
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

export default function Index() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState('games');
  const [balance, setBalance] = useState(4);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    if (amount && selectedMethod) {
      setBalance(balance + Number(amount));
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
              <span className="text-xl">🐻</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-primary leading-tight">LUCKY</h1>
              <h2 className="text-[10px] text-foreground font-semibold leading-tight">BEAR</h2>
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

        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎰</div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Добро пожаловать в Lucky Bear</h3>
          <p className="text-muted-foreground text-sm">Выберите категорию игр в меню выше</p>
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
            <div className="inline-block relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-blue-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-primary/50">
                <Icon name="Star" size={64} className="text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border-2 border-primary rounded-full px-4 py-1">
                <span className="text-3xl font-bold">LV.3</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">Серия-dy</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm">UID:1704028377</span>
              <Icon name="Copy" size={14} />
            </div>
            <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6">
              Посмотреть привилегии
            </Button>
          </div>

          <Card className="bg-card border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="Coins" size={20} className="text-white" />
                </div>
                <span className="text-3xl font-bold">{balance}</span>
              </div>
              <a href="#" className="text-primary text-sm">История ставок</a>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>Доступно для вывода</span>
                  <Icon name="HelpCircle" size={12} />
                </div>
                <div className="text-green-500 font-semibold">{balance}₽ {'>'}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>Сумма к разблокировке</span>
                  <Icon name="HelpCircle" size={12} />
                </div>
                <div className="text-primary font-semibold">0₽ {'>'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="HelpCircle" size={16} />
                <span>Остаток средств: 0₽</span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
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
            onClick={() => setShowDepositModal(true)}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground min-w-0 flex-1"
          >
            <Icon name="Wallet" size={22} />
            <span className="text-[10px]">Счёт</span>
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