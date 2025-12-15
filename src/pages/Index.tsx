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
  const [balance, setBalance] = useState(4000);
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl">🐻</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">LUCKY</h1>
              <h2 className="text-xs text-foreground font-semibold">BEAR</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border-2 border-primary/30 rounded-full px-4 py-2">
              <Icon name="Coins" className="text-accent" size={20} />
              <span className="font-semibold text-lg">{balance.toLocaleString()}</span>
            </div>
            <Button 
              onClick={() => setShowDepositModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              <Icon name="Wallet" size={18} className="mr-2" />
              Пополнить
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          <Button variant="ghost" className="rounded-full gap-2 bg-primary/10 text-primary">
            <Icon name="Clock" size={20} />
            История
          </Button>
          <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
            <Icon name="Heart" size={20} />
            Важное
          </Button>
          <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
            <Icon name="Gift" size={20} />
            Подарочный
          </Button>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'default' : 'outline'}
            className={`rounded-full ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Grid3x3" size={18} className="mr-2" />
            Все
          </Button>
          <Button
            onClick={() => setActiveTab('slots')}
            variant={activeTab === 'slots' ? 'default' : 'outline'}
            className={`rounded-full ${activeTab === 'slots' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Cherry" size={18} className="mr-2" />
            Слоты
          </Button>
          <Button
            onClick={() => setActiveTab('fast')}
            variant={activeTab === 'fast' ? 'default' : 'outline'}
            className={`rounded-full ${activeTab === 'fast' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
          >
            <Icon name="Zap" size={18} className="mr-2" />
            Быстрые игры
          </Button>
        </div>

        {(activeTab === 'all' || activeTab === 'slots') && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                🎰 Слоты
              </h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Все
                <Icon name="ChevronRight" size={18} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GAMES.slots.map((game) => (
                <Card
                  key={game.id}
                  className="group overflow-hidden border-border hover:border-primary/50 transition-all cursor-pointer hover-scale"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-sm font-semibold text-white mb-1">{game.title}</h4>
                      <span className="text-xs text-accent font-medium">{game.provider}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'fast') && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                ⚡ Быстрые игры
              </h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Все
                <Icon name="ChevronRight" size={18} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GAMES.fastGames.map((game) => (
                <Card
                  key={game.id}
                  className="group overflow-hidden border-border hover:border-primary/50 transition-all cursor-pointer hover-scale"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-sm font-semibold text-white mb-1">{game.title}</h4>
                      <span className="text-xs text-accent font-medium">{game.provider}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-primary">
              <Icon name="Gamepad2" size={24} />
              <span className="text-xs font-medium">Игры</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
              <Icon name="Star" size={24} />
              <span className="text-xs">VIP-партнёр</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
              <Icon name="Gift" size={24} />
              <span className="text-xs">Бонусы</span>
            </button>
            <button 
              onClick={() => setShowDepositModal(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Icon name="Wallet" size={24} />
              <span className="text-xs">Пополнить</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
              <Icon name="User" size={24} />
              <span className="text-xs">Профиль</span>
            </button>
          </div>
        </div>
      </nav>

      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Пополнение счета</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Выберите способ оплаты</label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon name={method.icon as any} size={32} className="mx-auto mb-2" />
                    <span className="text-sm font-medium block">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Сумма пополнения</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary outline-none text-lg"
              />
              <div className="flex gap-2 mt-3">
                {[500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(String(preset))}
                    className="flex-1 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={!selectedMethod || !amount}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
            >
              Пополнить баланс
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
