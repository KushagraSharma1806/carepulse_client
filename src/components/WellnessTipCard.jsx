import React, { useEffect, useState } from "react";

const TIPS = [
  "💧 Drink at least 8 glasses of water today.",
  "🚶‍♂️ Take a 15-minute walk to improve circulation.",
  "🍎 Eat a fresh fruit with breakfast.",
  "🧘 Practice 5 minutes of mindful breathing.",
  "😴 Aim for 7–8 hours of sleep tonight.",
  "📵 Avoid screens 30 minutes before bedtime.",
  "💪 Do some light stretching every 2 hours.",
  "🥗 Choose a healthy salad for lunch or dinner.",
  "😄 Call a loved one – emotional health matters!",
  "📝 Write 3 things you're grateful for today.",
  "🌞 Get 10-15 minutes of sunlight for vitamin D.",
  "📖 Read a book for at least 15 minutes to relax your mind.",
  "🎶 Listen to calming music to reduce stress.",
  "🍵 Replace one sugary drink with herbal tea today.",
  "🧠 Try a new puzzle or brain game to stay sharp.",
  "👫 Spend quality time with friends or family today.",
  "🌱 Add one extra vegetable to your meals today.",
  "🧴 Apply sunscreen before going outside.",
  "🚭 If you smoke, try to reduce by one cigarette today.",
  "🍽️ Eat slowly and savor each bite during your next meal.",
  "🛌 Maintain a consistent sleep schedule this week.",
  "🧂 Reduce added salt in your meals today.",
  "🍬 Choose fruit instead of processed sweets for dessert.",
  "🚰 Carry a water bottle with you throughout the day.",
  "🌿 Try a new healthy recipe this week.",
  "🦷 Floss your teeth tonight for better oral health.",
  "👀 Rest your eyes from screens every 20 minutes (20-20-20 rule).",
  "🧼 Wash your hands thoroughly throughout the day.",
  "🍌 Have a potassium-rich food like bananas or spinach today.",
  "🏞️ Spend time in nature to boost your mood.",
  "🧘‍♀️ Try a 5-minute meditation session today.",
  "🥛 Include calcium-rich foods in your diet today.",
  "🚴 Consider biking or walking for short trips today.",
  "📱 Set your phone to grayscale to reduce screen addiction.",
  "🍳 Start your day with a protein-rich breakfast.",
  "🌰 Snack on nuts instead of chips for healthier fats.",
  "🛁 Take a relaxing bath or shower before bed.",
  "🧦 Wear comfortable shoes that support your feet.",
  "📓 Keep a food journal to track your eating habits.",
  "🌼 Open windows to let fresh air circulate in your home.",
  "👃 Practice deep breathing through your nose for relaxation.",
  "🖊️ Journal about your feelings to process emotions.",
  "🚮 Declutter one small space in your home today.",
  "👂 Listen actively in conversations without distractions.",
  "🛌 Invest in a comfortable pillow for better sleep.",
  "🍯 Replace sugar with honey in your tea or coffee.",
  "👟 Stretch before and after exercise to prevent injury.",
  "🧴 Moisturize your skin after showering.",
  "🧄 Add garlic or onions to a meal for immune benefits.",
  "🌅 Wake up 15 minutes earlier for a calmer morning routine.",
  "🤗 Give someone a genuine compliment today.",
];

const WellnessTipCard = () => {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const savedTip = localStorage.getItem("wellness_tip");
    const savedDate = localStorage.getItem("wellness_tip_date");
    const today = new Date().toDateString();

    if (savedTip && savedDate === today) {
      setTip(savedTip);
    } else {
      const newTip = TIPS[Math.floor(Math.random() * TIPS.length)];
      setTip(newTip);
      localStorage.setItem("wellness_tip", newTip);
      localStorage.setItem("wellness_tip_date", today);
    }
  }, []);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">🧘 Today's Wellness Tip</h2>
      <p className="text-sm">{tip}</p>
    </div>
  );
};

export default WellnessTipCard;