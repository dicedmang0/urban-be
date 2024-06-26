const arrayFund = [
  {
    name: "Virtual Account",
    is_active: 1,
    child: [
      {
        code: "014",
        name: "BCA",
        is_active: 1,
      },
      {
        code: "008",
        name: "Mandiri",
        is_active: 1,
      },
      {
        code: "002",
        name: "BRI",
        is_active: 1,
      },
      {
        code: "009",
        name: "BNI",
        is_active: 1,
      },
      {
        code: "013",
        name: "Permata",
        is_active: 1,
      },
      {
        code: "011",
        name: "Danamon",
        is_active: 1,
      },
      {
        code: "022",
        name: "CIMB",
        is_active: 1,
      },
      {
        code: "153",
        name: "Sahabat Sampoerna",
        is_active: 1,
      },
    ],
  },
  {
    name: "Qris",
    is_active: 1,
    child: [],
  },
  {
    name: "E-Wallet",
    is_active: 1,
    child: [
      {
        code: "ovo",
        name: "OVO",
        is_active: 1,
      },
      {
        code: "dana",
        name: "DANA",
        is_active: 1,
      },
      {
        code: "shopeepay",
        name: "SHOPEEPAY",
        is_active: 1,
      },
      {
        code: "linkaja",
        name: "LINKAJA",
        is_active: 1,
      },
    ],
  },
  {
    name: "Retail",
    is_active: 1,
    child: [
      {
        code: "alfamart",
        name: "Alfamart",
        is_active: 1,
      },
      {
        code: "indomaret",
        name: "Indomaret",
        is_active: 1,
      },
    ],
  },
  {
    name: "Credit Card",
    is_active: 1,
    child: [],
  },
];

const arrayRecoveryQuestions = [
  {
    text: "What was the name of your first pet?",
    is_active: 1
  },
  {
    text: "What is your mother’s maiden name?",
    is_active: 1
  },
  {
    text: "What was the name of your elementary school?",
    is_active: 1
  },
  {
    text: "What was the make and model of your first car?",
    is_active: 1
  },
  {
    text: "In what city were you born?",
    is_active: 1
  },
  {
    text: "What is the name of the street you grew up on?",
    is_active: 1
  },
  {
    text: "What is the name of your favorite childhood friend?",
    is_active: 1
  },
  {
    text: "What is your favorite food?",
    is_active: 1
  },
  {
    text: "What was the name of your first employer?",
    is_active: 1
  },
  {
    text: "What is your favorite movie?",
    is_active: 1
  },
]

module.exports = {
  arrayFund: arrayFund,
  arrayRecoveryQuestions: arrayRecoveryQuestions
};
