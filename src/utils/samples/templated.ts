export const args = [
  [
    `
    &:active {
      background-color: `,
    `;
    }`,
  ] as any,
  "blue",
] as [TemplateStringsArray, string];

export const expected = [
  [
    `
    &:active {
      background-color: blue;
    }`,
  ],
];
