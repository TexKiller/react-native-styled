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
    webactive1: 
      webbackground-color: blue§
    ;`,
  ],
  [],
];
