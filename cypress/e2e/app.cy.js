describe("Landing", function () {
    it("should visit the landing page", function () {
      cy.visit("http://localhost:3000");
      cy.contains("Simplify Your Finances");
      cy.contains("2024 Expenses Multiplatform. All rights reserved.");
    });
  });
  
