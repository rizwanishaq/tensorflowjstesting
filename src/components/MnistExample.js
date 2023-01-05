import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import LossComponent from "./LossComponent";
import { IMAGE_H, IMAGE_W, MnistData } from "../data";

const MnistExample = () => {
  let data;
  data = new MnistData();
  const [model, setModel] = useState();
  const [trainData, setTrainData] = useState();
  const [testData, setTestData] = useState();
  const [loss, setLoss] = useState([]);
  const [acc, setAcc] = useState([]);

  async function load() {
    await data.load();
    setTrainData(data.getTrainData());
    setTestData(data.getTestData());
  }

  useEffect(() => {
    load();
    const model_ = tf.sequential();
    model_.add(
      tf.layers.conv2d({
        inputShape: [IMAGE_H, IMAGE_W, 1],
        kernelSize: 3,
        filters: 32,
        activation: "relu",
      })
    );
    model_.add(
      tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: "relu" })
    );
    model_.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
    model_.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
    model_.add(
      tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: "relu" })
    );
    model_.add(tf.layers.flatten({}));
    model_.add(tf.layers.dense({ units: 64, activation: "relu" }));
    model_.add(tf.layers.dense({ units: 10, activation: "softmax" }));
    model_.compile({
      optimizer: "rmsprop",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    setModel(model_);
  }, []);

  const handleClick = async () => {
    await model.fit(trainData.xs, trainData.labels, {
      batchSize: 16,
      epochs: 10,
      verbose: true,
      validationSplit: 0.15,
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          //   console.log(batch, logs);
          //   setLoss((prevloss) => [...prevloss, +logs["loss"].toFixed(2)]);
          //   setAcc((prevacc) => [...prevacc, +logs["acc"].toFixed(2)]);
        },
        onEpochEnd: async (epoch, logs) => {
          setLoss((prevloss) => [...prevloss, +logs["loss"].toFixed(2)]);
          setAcc((prevacc) => [...prevacc, +logs["acc"].toFixed(2)]);
        },
      },
    });
  };

  const handlePredict = () => {
    const examples = testData;
    tf.tidy(() => {
      const output = model.predict(examples.xs);
      const axis = 1;
      const labels = Array.from(examples.labels.argMax(axis).dataSync());
      const predictions = Array.from(output.argMax(axis).dataSync());
      console.log(labels[0], predictions[0]);
    });
  };

  return (
    <Container className="mt-2 mb-2">
      <LossComponent data={loss} text={"Loss"} />
      <LossComponent data={acc} text={"Accuracy"} />
      <Button onClick={handleClick}>Train the model</Button>
      <Button onClick={handlePredict}>Predict</Button>
    </Container>
  );
};

export default MnistExample;
