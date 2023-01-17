const { assert } = require('chai');
const { ActivityLocators } = require('../../pages/locators/activity');
const { PersonalUnitLocators } = require('../../pages/locators/personalUnit');

// Исходные данные на активности
const headerWindowInitial = 'Редактировать';
const nameActivityInitial = 'Входящий звонок';
const escalationFromInitial = 'Завтур Антон';
const createDataInitial = '08.11.2022, 23:30';
const phoneNumberInitial = '+79676075967';
const callIdInitial = '1040b080-dbe6-47f3-8eee-b1a7c0da7aec';

module.exports = async function () {
  const { browser } = this;

  await browser.setMeta('1', 'Найти в таблице тестовую активность');
  const rowList = await browser.$$(ActivityLocators.TABLE_ROW);
  const rowListLength = rowList.length;

  for (let i = 0; i < rowListLength; i = i + 1) {
    const row = rowList[i];
    const rowContent = await row.getText();

    if (rowContent.includes(createDataInitial)) {
      const nameActivity = await (await row.$(ActivityLocators.NAME_IN_TABLE_ROW)).getText();
      assert.equal(
        nameActivity,
        nameActivityInitial,
        'Название активности не совпадает с ожидаемым',
      );

      await browser.setMeta('2', 'Нажать кнопку Редактировать активность');
      const editButton = await row.$(ActivityLocators.EDIT_BUTTON);
      await editButton.click();

      await browser.setMeta('3', 'Проверить элементы модального окна активности');
      await browser.assertEqual(PersonalUnitLocators.MODAL_HEADER_OF_WINDOW, headerWindowInitial);
      await browser.assertEqual(PersonalUnitLocators.MODAL_ACTIVITY_TYPE, nameActivityInitial);
      await browser.assertEqual(PersonalUnitLocators.MODAL_ESCALATION_FROM, escalationFromInitial);
      await browser.assertEqual(PersonalUnitLocators.MODAL_CREATE_DATA, createDataInitial);
      await browser.assertEqual(PersonalUnitLocators.MODAL_PHONE_NUMBER, phoneNumberInitial);
      await browser.assertEqual(PersonalUnitLocators.MODAL_CALL_ID, callIdInitial);
      await browser.assertIsExist(PersonalUnitLocators.MODAL_ACCOUNT, 'аккаунт');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_OPPORTUNITIES, 'аккаунт');
      await browser.assertIsExist(
        PersonalUnitLocators.MODAL_NOT_RELATIVE_TO_OPP,
        'чекбокс "не относится к сделке"',
      );
      await browser.assertIsExist(PersonalUnitLocators.MODAL_AUDIO, 'аудио');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_TAGS, 'метки');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_COMMENT, 'комментарий');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_BUTTON_CLOSE, 'Кнопка Закрыть');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_BUTTON_SUBMIT, 'Кнопка Сохранить');
      await browser.assertIsExist(PersonalUnitLocators.MODAL_BUTTON_CANCEL, 'Кнопка Отменить');
    }
  }
};
