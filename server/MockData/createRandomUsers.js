const { Pool } = require("pg");
const config = require("../config.json");

const connection = new Pool({
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
    ssl: { rejectUnauthorized: false },
});

// adjust mock names as needed
// const firstNames = [
//     "John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah",
//     "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oscar", "Paul", "Quinn", "Rachel",
//     "Sam", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zane", "Amber", "Blake",
//     "Caleb", "Daisy", "Ethan", "Faith", "Grace", "Henry", "Isla", "Jack", "Kate", "Leo",
//     "Molly", "Nathan", "Olivia", "Peter", "Quincy", "Ruby", "Sarah", "Thomas", "Uma", "Violet"
// ];

// const lastNames = [
//     "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
//     "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
//     "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Carter",
//     "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
//     "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey"
// ];
const firstNames = [
    "John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah",
    "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oscar", "Paul", "Quinn", "Rachel",
    "Sam", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zane", "Amber", "Blake",
    "Caleb", "Daisy", "Ethan", "Faith", "Grace", "Henry", "Isla", "Jack", "Kate", "Leo",
    "Molly", "Nathan", "Olivia", "Peter", "Quincy", "Ruby", "Sarah", "Thomas", "Uma", "Violet",
    "Aaron", "Adrian", "Alexander", "Amanda", "Andrew", "Angela", "Anthony", "Ashley", "Austin", "Barbara",
    "Benjamin", "Bethany", "Brandon", "Brianna", "Cameron", "Caroline", "Christopher", "Claire", "Daniel", "Dominic",
    "Eleanor", "Elizabeth", "Emily", "Emma", "Eric", "Evelyn", "Felix", "Florence", "Frank", "Frederick",
    "Gabriel", "Gabrielle", "Gregory", "Harmony", "Harrison", "Heather", "Hugo", "Isabella", "Isaiah", "Jasmine",
    "Jason", "Jennifer", "Jeremy", "Jessica", "Jonathan", "Joseph", "Joshua", "Justin", "Katherine", "Kenneth",
    "Kimberly", "Kylie", "Lawrence", "Leah", "Leonard", "Liam", "Lily", "Linda", "Lucas", "Luke",
    "Madison", "Margaret", "Maria", "Mark", "Mary", "Matthew", "Maxwell", "Megan", "Melissa", "Michelle",
    "Nancy", "Natalie", "Nicholas", "Nicole", "Noah", "Oliver", "Owen", "Pamela", "Patricia", "Patrick",
    "Phoenix", "Phoebe", "Raymond", "Rebecca", "Richard", "Robert", "Rose", "Russell", "Ryan", "Sabrina",
    "Samuel", "Sandra", "Sean", "Sebastian", "Sharon", "Sophia", "Sophie", "Stephanie", "Stephen", "Steven",
    "Summer", "Sydney", "Theodore", "Timothy", "Trevor", "Tyler", "Valentina", "Victoria", "Vincent", "William",
    "Xavier", "Yvette", "Zachary", "Zoe", "Adam", "Addison", "Albert", "Alexandra", "Alexis", "Allison",
    "Amy", "Andrea", "Angelina", "Anna", "Annabelle", "Arthur", "Audrey", "August", "Aurora", "Autumn",
    "Avery", "Bailey", "Beatrice", "Bella", "Benjamin", "Bernard", "Bianca", "Bradley", "Brett", "Bridget",
    "Brooke", "Bruce", "Bryan", "Caitlin", "Calvin", "Candace", "Carl", "Carmen", "Carol", "Casey",
    "Cassandra", "Catherine", "Cecil", "Cecilia", "Chad", "Charlotte", "Chase", "Chelsea", "Chester", "Chloe",
    "Christina", "Christine", "Claude", "Clayton", "Clifford", "Clinton", "Cole", "Colin", "Conrad", "Constance",
    "Corey", "Craig", "Crystal", "Curtis", "Cynthia", "Dakota", "Dale", "Dallas", "Dana", "Danielle",
    "Danny", "Daphne", "Darcy", "Darius", "David", "Dawn", "Dean", "Deborah", "Deirdre", "Delilah",
    "Dennis", "Derek", "Destiny", "Devin", "Diego", "Dixon", "Donald", "Donna", "Doris", "Douglas",
    "Drake", "Drew", "Dustin", "Dylan", "Earl", "Eden", "Edgar", "Edison", "Edmund", "Edwin",
    "Elena", "Elijah", "Elise", "Elliott", "Eloise", "Elsa", "Emery", "Emmett", "Enrique", "Ernest",
    "Esther", "Etienne", "Eugene", "Evangeline", "Eve", "Ezra", "Fabian", "Farrah", "Felicity", "Fernando",
    "Finn", "Fletcher", "Floyd", "Forest", "Francis", "Franco", "Fred", "Garrett", "Gary", "Gavin",
    "Gene", "Geoffrey", "Gerald", "Gilbert", "Giselle", "Glenn", "Gloria", "Gordon", "Grant", "Greta",
    "Gwendolyn", "Hadley", "Haley", "Hamilton", "Harold", "Harper", "Harvey", "Hazel", "Heath", "Heidi",
    "Helen", "Herbert", "Holly", "Hope", "Howard", "Hubert", "Hunter", "Icarus", "Ida", "Ignatius",
    "Imogen", "India", "Indira", "Ingrid", "Irene", "Iris", "Irving", "Isaac", "Ivy", "Jackie",
    "Jacob", "Jade", "James", "Jamie", "Janet", "Janice", "Jared", "Jasper", "Jay", "Jean",
    "Jeffrey", "Jenna", "Jerome", "Jesse", "Jessie", "Jill", "Jim", "Joan", "Joanne", "Jocelyn",
    "Joel", "Joey", "John", "Jolene", "Jonas", "Jordan", "Jorge", "Joy", "Joyce", "Judith",
    "Judy", "Julie", "June", "Juniper", "Justice", "Karen", "Karl", "Karla", "Kasey", "Katie",
    "Kelly", "Kendall", "Kennedy", "Kent", "Kerry", "Kim", "Kirk", "Knox", "Kurt", "Kyle",
    "Lachlan", "Laila", "Lance", "Landon", "Lane", "Lara", "Larissa", "Larry", "Latoya", "Lauren",
    "Laurence", "Lavender", "Lavinia", "Lawson", "Leanne", "Lee-Ann", "Leigh", "Leila", "Leslie", "Lewis",
    "Liberty", "Lilah", "Lincoln", "Lindsay", "Lloyd", "Logan", "Lola", "London", "Lorenzo", "Louis",
    "Louise", "Lucia", "Lucian", "Lucy", "Luis", "Luna", "Luther", "Lydia", "Lyle", "Lynn",
    "Lysander", "Macey", "Madeline", "Mae", "Magnus", "Malcolm", "Mandy", "Marcus", "Mariah", "Marina",
    "Mario", "Marisa", "Marjorie", "Marlene", "Marlon", "Martha", "Martin", "Marvin", "Mason", "Matilda",
    "Maurice", "Maximilian", "May", "Melanie", "Melinda", "Mercedes", "Meredith", "Meryl", "Michaela", "Miguel",
    "Miles", "Milton", "Miranda", "Mitchell", "Monica", "Montgomery", "Morgan", "Mortimer", "Murray", "Myles",
    "Myra", "Nadine", "Naomi", "Napoleon", "Natasha", "Neil", "Neville", "Newton", "Niall", "Nicola",
    "Nigel", "Noel", "Nora", "Norman", "Norris", "Octavia", "Odette", "Olga", "Olive", "Omar",
    "Opal", "Orlando", "Orson", "Oswald", "Otto", "Pablo", "Paige", "Palmer", "Paris", "Pascal",
    "Patience", "Patricia", "Patsy", "Paula", "Pauline", "Paxton", "Pearl", "Peggy", "Penelope", "Percy",
    "Perry", "Philip", "Phyllis", "Pierce", "Piers", "Polly", "Preston", "Primrose", "Priscilla", "Prudence",
    "Quentin", "Quiana", "Quinlan", "Quinn", "Rafferty", "Raina", "Ralph", "Ramona", "Randall", "Randy",
    "Raphael", "Raquel", "Ray", "Regina", "Reid", "Renata", "Rene", "Reuben", "Rex", "Rhett",
    "Rhiannon", "Rhonda", "Ricardo", "Riley", "Rita", "River", "Roberta", "Roderick", "Rodney", "Roger",
    "Roland", "Roman", "Romeo", "Rosalie", "Rosemary", "Ross", "Roxanne", "Roy", "Ruben", "Rufus",
    "Ruth", "Sabine", "Sadie", "Sage", "Sally", "Salvatore", "Samantha", "Sampson", "Sander", "Sandy",
    "Santiago", "Sara", "Scarlett", "Scott", "Seamus", "Selena", "Serena", "Seth", "Seymour", "Shane",
    "Shannon", "Shaun", "Shawn", "Sheila", "Shelby", "Sheldon", "Sheridan", "Sherman", "Sheryl", "Shirley",
    "Sidney", "Sienna", "Sierra", "Simon", "Simone", "Sinclair", "Skylar", "Sloane", "Solomon", "Sonia",
    "Spencer", "Spike", "Stanley", "Stella", "Sterling", "Stuart", "Sue", "Sullivan", "Sunny", "Susan",
    "Suzanne", "Sylvester", "Sylvia", "Tabitha", "Tamara", "Tanya", "Taylor", "Terence", "Teresa", "Terrance",
    "Terry", "Thaddeus", "Theo", "Theresa", "Thora", "Thornton", "Tiffany", "Timothy", "Tobias", "Todd",
    "Tom", "Tony", "Tracy", "Travis", "Trinity", "Tristan", "Troy", "Tucker", "Tyrone", "Ulysses",
    "Valentine", "Valerie", "Vanessa", "Vaughn", "Vera", "Vernon", "Veronica", "Vicki", "Vicky", "Vincent",
    "Viola", "Virginia", "Vivian", "Wade", "Wallace", "Walter", "Warren", "Wayne", "Wesley", "Weston",
    "Whitney", "Wilbur", "Wiley", "Wilfred", "Wilhelm", "Will", "Willis", "Wilson", "Winston", "Wolf",
    "Wyatt", "Xerxes", "Ximena", "Yale", "Yolanda", "Yvonne", "Zander", "Zelda", "Zena", "Zinnia"
];

const lastNames = [
    "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
    "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
    "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
    "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey",
    "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez",
    "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross",
    "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington",
    "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes",
    "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan",
    "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz",
    "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter",
    "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos",
    "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels",
    "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn",
    "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold",
    "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham",
    "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver",
    "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson",
    "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver",
    "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell", "Alvarez",
    "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George",
    "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch",
    "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler",
    "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas",
    "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis",
    "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett",
    "Obrien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers",
    "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman",
    "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy",
    "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball",
    "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins",
    "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cumming"];

const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const createRandomUsers = async () => {
    try {
        const users = [];
        // adjust the number of users as needed
        for (let i = 0; i < 10000; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@testdata.com`;
            const password = generateRandomString(6);
            users.push({ name, email, password });
        }

        const query = `
      INSERT INTO Users (name, email, password) 
      VALUES ($1, $2, $3);
    `;

        for (const user of users) {
            await connection.query(query, [user.name, user.email, user.password]);
        }

        console.log("1000 random users created successfully!");
        process.exit();
    } catch (error) {
        console.error("Error in createRandomUsers:", error);
        process.exit(1);
    }
};

createRandomUsers();
