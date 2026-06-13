/*
 * Tło strony — pliki z images/posters/ (te same co sekcja Posters lub podzbiór)
 */
var POSTER_BACKGROUNDS = [
	'1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg',  '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg'
];

/*
 * Kolejność sekcji: Posters → Thumbnails → Business Cards → Flyers
 */
var WORK_CATEGORIES = [
	{
		slug: 'posters',
		label: 'Posters',
		folder: 'posters',
		images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg',  '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg']
	},
	{
		slug: 'thumbnails',
		label: 'Thumbnails',
		folder: 'thumbnails',
		images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg']
	},
	{
		slug: 'business-cards',
		label: 'Business Cards',
		folder: 'business-cards',
		images: ['1.jpg', '2.jpg']
	},
	{
		slug: 'flyers',
		label: 'Flyers',
		folder: 'flyers',
		images: ['1.jpg', '2.jpg', '3.jpg']
	}
];

/* Opcjonalne przyszłe kategorie — puste = ukryte */
var FUTURE_CATEGORIES = [];
