<template>
  <div v-if="currentInvoice" class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
          }"
        >
          <span v-if="currentInvoice.invoicePaid">Paid</span>
          <span v-if="currentInvoice.invoiceDraft">Draft</span>
          <span v-if="currentInvoice.invoicePending">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice" class="dark-purple">Edit</button>
        <button @click="deleteInvoice(currentInvoice.docId)" class="red">Delete</button>
        <button @click="updateStatusToPaid(currentInvoice.docId)" v-if="currentInvoice.invoicePending" class="green">
          Mark as Paid
        </button>
        <button
          v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
          @click="updateStatusToPending(currentInvoice.docId)"
          class="orange"
        >
          Mark as Pending
        </button>
        <button @click="print" class="green">Print</button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
          <p>{{ currentInvoice.productDescription }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>
            {{ currentInvoice.invoiceDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ currentInvoice.clientName }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Phone Number</h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div v-for="(item, index) in currentInvoice.invoiceItemList" :key="index" class="item flex">
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Total Amount</p>
          <p>{{ currentInvoice.invoiceTotal }}</p>&nbsp;Baht
        </div>
      </div>
    </div>

    <!-- Invoice Print -->
    <div class="invoice-details flex flex-column print-invoice" id="printMe">
      <div class="top flex">
        <div class="left flex flex-column">
          <h1><p class="thai-font">ใบเสร็จรับเงิน</p></h1>
          <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4><p class="thai-font">วันที่</p></h4>
          <p>
            {{ currentInvoice.invoiceDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4><p class="thai-font">ชื่อ-นามสกุล</p></h4>
          <p>{{ currentInvoice.clientName }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4><p class="thai-font">เบอร์โทรศัพท์</p></h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <div class="table table-header course-name"><p class="thai-font">คอร์สเรียน</p></div>
            <div class="table table-header qty"><p class="thai-font">จำนวน</p></div>
            <div class="table table-header price"><p class="thai-font">ราคา</p></div>
            <div class="table table-header price"><p class="thai-font">จำนวนเงิน</p></div>
          </div>
          <div v-for="(item, index) in currentInvoice.invoiceItemList" :key="index" class="item flex">
            <div class="table course-name"><p>{{ item.itemName }}</p></div>
            <div class="table qty"><p>{{ item.qty }}</p></div>
            <div class="table price"><p>{{ item.price }}</p></div>
            <div class="table price"><p>{{ item.total }}</p></div>
          </div>
        </div>
        <div class="total flex">
          <div class="right flex flex-column">
            <div class="heading flex">
              <div class="total-row"><p>ยอดรวม</p></div>
              <div class="total-row"><p>{{ currentInvoice.invoiceTotal }}</p></div>
            </div>
            <div class="heading flex">
              <div class="total-row"><p>ส่วนลด</p></div>
              <div class="total-row"><p>0</p></div>
            </div>
             <div class="heading flex">
              <div class="total-row"><p>ยอดรวมหลังหักส่วนลด</p></div>
              <div class="total-row"><p>{{ currentInvoice.invoiceTotal }}</p></div>
            </div>
            <div class="heading flex">
              <div class="total-row"><p>ภาษีมูลค่าเพิ่ม (7%)</p></div>
              <div class="total-row"><p>0</p></div>
            </div>
            <div class="heading flex total-amount">
              <div class="total-row"><p>ยอดสุทธิ</p></div>
              <div class="total-row"><p>{{ currentInvoice.invoiceTotal }}</p></div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "invoiceView",
  data() {
    return {
      currentInvoice: null,
    };
  },
  created() {
    this.getCurrentInvoice();
  },
  methods: {
    ...mapMutations(["SET_CURRENT_INVOICE", "TOGGLE_EDIT_INVOICE", "TOGGLE_INVOICE"]),

    ...mapActions(["DELETE_INVOICE", "UPDATE_STATUS_TO_PENDING", "UPDATE_STATUS_TO_PAID"]),

    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
      this.currentInvoice = this.currentInvoiceArray[0];
    },

    toggleEditInvoice() {
      this.TOGGLE_EDIT_INVOICE();
      this.TOGGLE_INVOICE();
    },

    async deleteInvoice(docId) {
      await this.DELETE_INVOICE(docId);
      this.$router.push({ name: "Home" });
    },

    updateStatusToPaid(docId) {
      this.UPDATE_STATUS_TO_PAID(docId);
    },

    updateStatusToPending(docId) {
      this.UPDATE_STATUS_TO_PENDING(docId);
    },

    print() {
      var prtContent = document.getElementById("printMe");
      // Get all stylesheets HTML
      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

      var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Prompt&display=swap');
          </style>
          <style type="text/css">
            body {
              padding: 30px;
            }
            .left.flex.flex-column {
              justify-content: flex-start;
              margin-right: auto;
            }
            .right.flex.flex-column {
              width: 360px;
              justify-content: flex-end;
              margin-left: auto;
            }
            .top.flex {
                margin-bottom: 40px;
            }
            .middle.flex {
                margin: 40px 0;
            }
            .bottom.flex {
                margin-top: 40px;
            }
            .payment.flex.flex-column {
                justify-content: flex-start;
                margin-right: auto;
            }
            .send-to.flex.flex-column {
              justify-content: flex-end;
              margin-left: auto;
            }
            .table {
              display: block;
              flex-grow: 1;
              flex-shrink: 1;
              padding: 0.75rem;
              border: 1px solid;
              font-size: 12px;
            }
            .table-header {
              background: lightgray
            }
            .billing-items {
              border: 1px solid;
            }
            .total.flex {
                margin-top: 40px;
            }
            .total-row {
              display: block;
              flex-basis: 0;
              flex-grow: 1;
              flex-shrink: 1;
              padding: 0.75rem;
              min-width: fit-content;
              text-align: right;
            }
            .total-amount {
              margin: 20px 0;
              border-top: 1px solid;
              border-bottom: 1px solid;
            }
            .thai-font {}
            .course-name {
              width: 60%;
            }
            .price {
              width: 15%;
            }
            .qty {
              width: 10%;
            }
          </style>
          ${stylesHtml}
        </head>
        <body>
          ${prtContent.innerHTML}
        </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }
  },
  computed: {
    ...mapState(["currentInvoiceArray", "editInvoice"]),
  },
  watch: {
    editInvoice() {
      if (!this.editInvoice) {
        this.currentInvoice = this.currentInvoiceArray[0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.print-invoice {
  display: none;
}
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
