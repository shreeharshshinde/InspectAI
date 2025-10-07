from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Trainer, TrainingArguments
from datasets import load_dataset

model_name = "Salesforce/codet5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)

dataset = load_dataset("csv", data_files="data/processed/train_dataset.csv")

def preprocess(examples):
    inputs = ["Fix this code: " + d for d in examples["diff_added"]]
    outputs = examples["comment"]
    model_inputs = tokenizer(inputs, max_length=256, truncation=True)
    labels = tokenizer(outputs, max_length=64, truncation=True).input_ids
    model_inputs["labels"] = labels
    return model_inputs

tokenized = dataset.map(preprocess, batched=True)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

args = TrainingArguments(
    output_dir="models/codet5_finetuned",
    per_device_train_batch_size=4,
    num_train_epochs=3,
    logging_steps=100,
    save_strategy="epoch",
)

trainer = Trainer(model=model, args=args, train_dataset=tokenized["train"])
trainer.train()
